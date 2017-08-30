const slug = require("slugo")
    , deffy = require("deffy")

const USER_FIELDS = {
    password: 0
}

const TopicSchema = new Bloggify.db.Schema({
    author: {
        type: String,
        index: true
    },
    title: {
        type: String,
        text: true
    },
    slug: {
        type: String,
        index: true
    },
    body: {
        type: String,
        text: true
    },
    created_at: Date,
    votes: [String],
    sticky: Boolean,
    metadata: Object
})

TopicSchema.virtual("url").get(function () {
    return `/posts/${this._id}-${this.slug}`
})

// Hooks
TopicSchema.pre("save", function (next) {
    this.set("title", deffy(this.title, "").trim())
    this.set("body", deffy(this.body, "").trim())
    if (!this.title.length) {
        return next(new Error("Topic title cannot be empty."))
    }
    if (!this.body.length) {
        return next(new Error("Topic body cannot be empty."))
    }
    this.set("slug", slug(this.title))
    this.wasNew = this.isNew
    next()
})

TopicSchema.post("save", function (next) {
    const topic = this
    if (topic.wasNew) {
        Topic.emitTopicCreated(topic._id)
    } else {
        Topic.emitTopicUpdated(topic._id)
    }
    next()
})

// Statics
TopicSchema.statics.create = (data, cb) => {
    data.sticky = !!data.sticky
    return new Topic(data).save(cb)
}

TopicSchema.statics.remove = (filters, cb) => {
    Topic.remove(filters, cb)
}

TopicSchema.statics.populateTopic = (item, options) => {

    if (Array.isArray(item)) {
        return Promise.all(item.map(c => Topic.populate(c, options)))
    }

    options = options || {}
    options.userFields = options.userFields || USER_FIELDS

    return Promise.all([
        Bloggify.models.User.getUser({
            filters: { _id: item.author },
            fields: options.userFields
        })
      , Topic.getComments(item, undefined, options)
    ]).then(data => {
        item.author = data[0]
        item.comments = data[1]
        item.url = Topic.getUrl(item)
        return item
    })
}

TopicSchema.statics.getComments = (item, cb, opts) => {
    opts = opts || {}
    opts.userFields = opts.userFields || USER_FIELDS
    return Bloggify.models.Comment.query({
        filters: {
            topic: item._id
        }
    }).then(comments => {
        return Promise.all(comments.map(comment => {
            return Bloggify.models.User.getUser({
                filters: { _id: comment.author },
                fields: opts.userFields
            }).then(author => {
                comment = comment.toObject()
                comment.author = author.toObject()
                return comment
            })
        }))
    })
}

TopicSchema.statics.update = (filters, data, cb) => {
    Topic.get(filters, (err, topic) => {
        if (err) { return cb(err); }
        if (data.sticky === undefined) {
            data.sticky = topic.sticky
        }
        topic.set(data).save(cb)
    })
}

TopicSchema.statics.get = (filters, cb) => {
    return Topic.findOne(filters, (err, topic) => {
        if (!err && !topic) {
            err = new Error("There is no such topic.")
        }
        cb(err, topic)
    })
}

TopicSchema.statics.getMore = (opts, cb) => {
    opts = opts || {}
    //opts.limit = opts.limit || 5
    let topics = []
    return Topic.find(opts.filters, opts.fields).limit(opts.limit).sort({
        created_at: -1
    }).then(data => {
        topics = data.map(c => c.toObject())
        data = null
        return Topic.populate(topics, {
            userFields: {
                "profile.commits": 0,
                "email": 0,
                "password": 0
            }
        })
    }).then(data => {
        cb(null, data)
    }).catch(err => cb(err))
}

TopicSchema.statics.getPopulated = (id, cb, opts) => {
   Topic.get({
      _id: id
   }, (err, topic) => {
       if (err && err.name === "CastError") {
           err = null
           topic = null
       }
       if (err) { return cb(err); }
       Topic.populate(topic.toObject(), opts).then(topic => {
           cb(null, topic)
       }).catch(e => cb(e))
   })
}

TopicSchema.statics.emitTopicCreated = (id) => {
    Topic.getPopulated({
        _id: id
    }, (err, topic) => {
        topic && Bloggify.emit("topic:created", topic)
    })
}

TopicSchema.statics.emitTopicUpdated = (id) => {
    Topic.getPopulated({
        _id: id
    }, (err, topic) => {
        topic && Bloggify.emit("topic:updated", topic)
    })
}

TopicSchema.statics.postComment = (data, cb) => {
    data.votes = 0
    data.created_at = new Date()
    Bloggify.models.Comment.createComment(data, (err, comment) => {
        if (!err) {
            Topic.emitTopicUpdated(data.topic)
        }
        cb(err, comment)
    })
}

TopicSchema.statics.toggleVote = (data, cb) => {
    const filters = {
        _id: data.topic
    }

    if (!Bloggify.services.session.isAdmin(data.user)) {
        filters["metadata.hack_type"] = data.user.profile.hack_type
        filters["metadata.hack_id"] = data.user.profile.hack_id
    }

    Topic.get(filters, (err, topic) => {
        if (err) { return cb(err); }
        const votes = topic.toObject().votes
        if (votes.includes(data.user._id)) {
            votes.splice(votes.indexOf(data.user._id), 1)
        } else {
            votes.push(data.user._id)
        }
        topic.set("votes", votes)
        topic.save(cb)
    })
}

TopicSchema.statics.updateComment = (filters, commentBody, cb) => {
    commentBody = deffy(commentBody, "").trim()
    if (!commentBody) {
        return cb(new Error("The comment body cannot be blank."))
    }
    Bloggify.models.Comment.getComment(filters, (err, comment) => {
        if (err) { return cb(err); }
        comment.set("body", commentBody)
        comment.save(cb).then(c => {
            Topic.emitTopicUpdated(comment.topic)
        })
    })
}
TopicSchema.statics.deleteComment = (filters, cb) => {
    Bloggify.models.Comment.remove(filters, cb)
}

TopicSchema.statics.toggleCommentVote = (data, cb) => {
    Comment.get({
        _id: data.comment
    }, (err, comment) => {
        if (err) { return cb(err); }
        const votes = comment.toObject().votes
        if (votes.includes(data.user)) {
            votes.splice(votes.indexOf(data.user), 1)
        } else {
            votes.push(data.user)
        }
        comment.set("votes", votes)
        comment.save(cb).then(c => {
            Topic.emitTopicUpdated(comment.topic)
        })
    })
}

const Topic = module.exports = Bloggify.db.model("Topic", TopicSchema)
