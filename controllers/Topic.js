const slug = require("slug");
const User = require("./User");
const Comment = require("./Comment");

let TopicModel = null;
setTimeout(function() {
    TopicModel = Bloggify.models.Topic
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
        return TopicModel.findOne(filters, cb);
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
    static postComment(data, cb) {
        data.votes = 0;
        data.created_at = new Date();
        Comment.create(data, cb);
    }
};
