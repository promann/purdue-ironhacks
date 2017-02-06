const Bloggify = require("bloggify")
    , slug = require("slug")
    , User = require("./User")
    , Comment = require("./Comment")
    , deffy = require("deffy")
    , Session = require("./Session");
    ;

const USER_FIELDS = {
    password: 0
};

class Topic {
    static create (data, cb) {
        data.slug = slug(data.title, { lower: true });
        data.sticky = !!data.sticky;
        return new Topic.model(data).save(cb);
    }

    static remove (filters, cb) {
        Topic.model.remove(filters, cb);
    }

    static populate (item, options) {

        if (Array.isArray(item)) {
            return Promise.all(item.map(c => Topic.populate(c, options)));
        }

        options = options || {};
        options.userFields = options.userFields || USER_FIELDS

        return Promise.all([
            User.get({
                filters: { _id: item.author },
                fields: options.userFields
            })
          , Topic.getComments(item, undefined, options)
        ]).then(data => {
            item.author = data[0];
            item.comments = data[1];
            item.url = Topic.getUrl(item);
            return item;
        });
    }

    static getComments (item, cb, opts) {
        opts = opts || {};
        opts.userFields = opts.userFields || USER_FIELDS;
        return Comment.query({
            filters: {
                topic: item._id
            }
        }).then(comments => {
            return Promise.all(comments.map(comment => {
                return User.get({
                    filters: { _id: comment.author },
                    fields: opts.userFields
                }).then(author => {
                    comment = comment.toObject();
                    comment.author = author.toObject();
                    return comment;
                });
            }));
        });
    }

    static update (filters, data, cb) {
        Topic.get(filters, (err, topic) => {
            if (err) { return cb(err); }
            data.sticky = !!data.sticky;
            topic.set(data).save(cb);
        });
    }

    static get (filters, cb) {
        return Topic.model.findOne(filters, (err, topic) => {
            if (!err && !topic) {
                err = new Error("There is no such topic.");
            }
            cb(err, topic);
        });
    }

    static getUrl (topic) {
        return `/posts/${topic._id}-${topic.slug}`;
    }

    static getMore (opts, cb) {
        opts = opts || {};
        //opts.limit = opts.limit || 5;
        let topics = [];
        return Topic.model.find(opts.filters, opts.fields).limit(opts.limit).sort({
            created_at: -1
        }).then(data => {
            topics = data.map(c => c.toObject());
            data = null;
            return Topic.populate(topics);
        }).then(data => {
            cb(null, data);
        }).catch(err => cb(err));
    }

    static getPopulated (id, cb, opts) {
       Topic.get({
          _id: id
       }, (err, topic) => {
           if (err && err.name === "CastError") {
               err = null;
               topic = null;
           }
           if (err) { return cb(err); }
           Topic.populate(topic.toObject(), opts).then(topic => {
               cb(null, topic);
           }).catch(e => cb(e));
       });
    }

    static emitTopicCreated (id) {
        Topic.getPopulated({
            _id: id
        }, (err, topic) => {
            topic && Bloggify.emit("topic:created", topic);
        });
    }

    static emitTopicUpdated (id) {
        Topic.getPopulated({
            _id: id
        }, (err, topic) => {
            topic && Bloggify.emit("topic:updated", topic);
        });
    }

    static postComment(data, cb) {
        data.votes = 0;
        data.created_at = new Date();
        Comment.create(data, (err, comment) => {
            if (!err) {
                Topic.emitTopicUpdated(data.topic);
            }
            cb(err, comment);
        });
    }

    static toggleVote (data, cb) {
        const filters = {
            _id: data.topic
        };

        if (!Session.isAdmin(data.user)) {
            filters["metadata.university"] = data.user.profile.university;
            filters["metadata.hack_id"] = data.user.profile.hack_id;
        }

        Topic.get(filters, (err, topic) => {
            if (err) { return cb(err); }
            const votes = topic.toObject().votes;
            if (votes.includes(data.user._id)) {
                votes.splice(votes.indexOf(data.user._id), 1);
            } else {
                votes.push(data.user._id);
            }
            topic.set("votes", votes);
            topic.save(cb);
        });
    }

    static toggleCommentVote (data, cb) {
        Comment.get({
            _id: data.comment
        }, (err, comment) => {
            if (err) { return cb(err); }
            const votes = comment.toObject().votes;
            if (votes.includes(data.user)) {
                votes.splice(votes.indexOf(data.user), 1);
            } else {
                votes.push(data.user);
            }
            comment.set("votes", votes);
            comment.save(cb).then(c => {
                Topic.emitTopicUpdated(comment.topic);
            });
        });
    }
};

Topic.model = Bloggify.models.Topic;
Topic.model.addHook("pre", "save", function (next) {
    this.set("title", deffy(this.title, "").trim());
    this.set("body", deffy(this.body, "").trim());
    if (!this.title.length) {
        return next(new Error("Topic title cannot be empty."));
    }
    if (!this.body.length) {
        return next(new Error("Topic body cannot be empty."));
    }
    this.wasNew = this.isNew;
    next();
});

Topic.model.addHook("post", "save", function (next) {
    const topic = this;
    if (topic.wasNew) {
        Topic.emitTopicCreated(topic._id);
    } else {
        Topic.emitTopicUpdated(topic._id);
    }
    next();
});

module.exports = Topic;