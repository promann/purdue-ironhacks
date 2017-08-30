const deffy = require("deffy")

const CommentSchema = new Bloggify.db.Schema({
    author: {
        type: String,
        index: true
    },
    body: {
        type: String,
        text: true
    },
    created_at: {
        type: Date,
        index: true
    },
    topic: {
        type: String,
        index: true
    },
    votes: [String]
})

// Hooks
CommentSchema.pre("save", function (next) {
    this.wasNew = this.isNew
    next()
})

CommentSchema.post("save", function (next) {
    if (this.wasNew) {
        Bloggify.emit("comment:created", this)
    }
    next()
})

const Comment = module.exports = Bloggify.db.model("Comment", CommentSchema)

// Create comment
CommentSchema.statics.createComment = (data, cb) => {
    data.body = deffy(data.body, "").trim()
    data.votes = []
    if (!data.body.length) {
        return cb(new Error("Comment cannot be empty."))
    }
    return new Comment(data).save(cb)
}

// Get comment
CommentSchema.statics.getComment = (findOne, cb) => {
    return Comment.findOne(filters, cb)
}

// Query comments
CommentSchema.statics.queryComments = (opts, cb) => {
    opts = opts || {}
    let topics = []
    return Comment.model.find(opts.filters, opts.fields).sort({
        created_at: 1
    }).exec(cb)
}
