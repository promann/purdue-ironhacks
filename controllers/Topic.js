const slug = require("slug");
const User = require("./User");
const Comment = require("./Comment");

const USER_FIELDS = {
    password: 0
};

let TopicModel = null;
setTimeout(function() {
    TopicModel = Bloggify.models.Topic
    TopicModel.schema.pre("save", function (next) {
        this.wasNew = this.isNew;
        next();
    });
    TopicModel.schema.post("save", topic => {
        if (topic.wasNew) {
            module.exports.emitTopicCreated(topic._id);
        } else {
            module.exports.emitTopicUpdated(topic._id);
        }
    });
}, 1000);

module.exports = class Topic {
    // TODO Validation
    static create (data, cb) {
        data.slug = slug(data.title, { lowercase: true });
        data.sticky = !!data.sticky;
        return new TopicModel(data).save(cb);
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
        return TopicModel.findOne(filters, (err, topic) => {
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
        return TopicModel.find(opts.filters, opts.fields).limit(opts.limit).sort({
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
        Topic.get({
            _id: data.topic
        }, (err, topic) => {
            if (err) { return cb(err); }
            const votes = topic.toObject().votes;
            if (votes.includes(data.user)) {
                votes.splice(votes.indexOf(data.user), 1);
            } else {
                votes.push(data.user);
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
