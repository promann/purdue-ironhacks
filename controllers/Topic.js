const slug = require("slug");
const User = require("./User");
const Comment = require("./Comment");

let TopicModel = null;
setTimeout(function() {
    TopicModel = Bloggify.models.Topic
    TopicModel.schema.post("save", topic => {
        module.exports.emitTopicUpdated(topic._id);
    });
}, 1000);

module.exports = class Topic {
    // TODO Validation
    static create (data, cb) {
        data.slug = slug(data.title, { lowercase: true });
        return new TopicModel(data).save(cb);
    }

    static populate (item) {
        if (Array.isArray(item)) {
            return Promise.all(item.map(c => Topic.populate(c)));
        }

        return Promise.all([
            User.model.findOne({
                _id: item.author
            }, {
                username: 1
            })
          , Topic.getComments(item)
        ]).then(data => {
            item.author = data[0];
            item.comments = data[1];
            item.url = Topic.getUrl(item);
            return item;
        });
    }

    static getComments (item, cb) {
        return Comment.query({
            filters: {
                topic: item._id
            }
        }, cb);
    }

    static update (filters, data, cb) {
        Topic.get(filters, (err, topic) => {
            if (err) { return cb(err); }
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
        opts.limit = opts.limit || 5;
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

    static getPopulated (id, cb) {
       Topic.get({
          _id: id
       }, (err, topic) => {
           if (err && err.name === "CastError") {
               err = null;
               topic = null;
           }
           if (err) { return cb(err); }
           Topic.populate(topic.toObject()).then(topic => {
               cb(null, topic);
           }).catch(e => cb(e));
       });
    }

    static emitTopicUpdated (id) {
        Topic.getPopulated({
            _id: id
        }, (err, topic) => {
            topic && Bloggify.wsNamespaces.topic.emit("updated", topic)
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
            const votes = topic.get("votes");
            if (votes.includes(data.user)) {
                votes.splice(votes.indexOf(data.user), 1);
            } else {
                votes.push(data.user);
            }
            topic.set("votes", votes);
            topic.save(cb);
        });
    }
};
