const slug = require("slug");
const User = require("./User");
const Comment = require("./Comment");

let CommentModel = null;
setTimeout(function() {
    CommentModel = Bloggify.models.Comment
    CommentModel.schema.pre("save", function (next) {
        this.wasNew = this.isNew;
        next();
    });
    CommentModel.schema.post("save", function (comment) {
        if (this.wasNew) {
            Bloggify.emit("comment:created", comment);
        }
    });
}, 1000);

module.exports = class Comment {
    // TODO Validation
    static create (data, cb) {
        return new CommentModel(data).save(cb);
    }
    static get (filters, cb) {
        return CommentModel.findOne(filters, cb);
    }
    static query (opts, cb) {
        opts = opts || {};
        let topics = [];
        return CommentModel.find(opts.filters, opts.fields).sort({
            created_at: 1
        }).exec(cb);
    }
};
