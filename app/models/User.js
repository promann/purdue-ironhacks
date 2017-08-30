const ul = require("ul")
    , regexEscape = require("regex-escape")
    , deffy = require("deffy")


const UserSchema = new Bloggify.db.Schema({
    username: {
        type: String,
        index: true
    },
    email: {
        type: String,
        index: true
    },
    password: String,
    profile: Object,
    role: String
})

UserSchema.virtual("profile_url").get(function () {
    return `/users/${this.username}`
})

UserSchema.statics.getUser = (data, cb) => {
    if (data.filters) {
        return User.findOne(data.filters, data.fields, cb)
    }
    const $or = []
    if (data.email) {
        $or.push({ email: data.email })
    }
    if (data.username) {
        $or.push({ username: new RegExp("^" + regexEscape(data.username) + "$", "i") })
    }
    return User.findOne({
        $or: $or
    }, cb)
}

UserSchema.statics.createUser = (data, cb) => {
    User.count({
        $or: [
            { username: data.username },
            { email: data.email }
        ]
    }, (err, exists) => {
        if (err) { return cb(err); }
        if (exists) {
            return cb(new Error("Email/username is already registered."))
        }

        const HACK_TYPES = Bloggify.services.hack_types
            , now = new Date()
            , hType = HACK_TYPES[data.profile.hack_type]
            , create = () => new User(data).save(cb)


        if (now > hType.start_date) {
            hType.getHackId(id => {
                data.profile.hack_id = id
                create()
            })
        } else {
            data.profile.hack_id = null
            create()
        }
    })
}

UserSchema.statics.updateUser = (filters, data, cb) => {
    return User.findOne(filters).then(user => {
        if (!user) {
            throw new Error("User not found.");
        }
        let update = ul.deepMerge(data, user.toObject());
        delete update._id;
        user.set(update);
        return user.save(cb);
    });
}

UserSchema.statics.createTopic = (data, cb) => {
    const Topic = Bloggify.models.Topic;
    return Topic.create(data, cb);
}

UserSchema.statics.removeUser = (userId, cb) => {
    userId = deffy(userId, "");
    if (!userId) { return cb(new Error("Invalid user id.")); }

    // Delete user
    User.remove({
        _id: userId
    }, err => {
        if (err) { return Bloggify.log(err); }

        // Delete comments
        Bloggify.models.Topic.remove({
            author: userId
        }, err => {
            if (err) { return Bloggify.log(err); }

            // Delete posts
            Bloggify.models.Comment.remove({
                author: userId
            }, err => {
                if (err) { return Bloggify.log(err); }
                cb();
            });
        })
    });
}

UserSchema.statics.auth = (data, cb) => {
    User.getUser(data, (err, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(new Error("User not found.")); }
        if (user.password !== data.password) {
            cb(new Error("Incorrect password."))
        } else {
            cb(null, user)
        }
    })
}

const User = module.exports = Bloggify.db.model("User", UserSchema)

UserSchema.pre("save", function (next) {
    const phases = ["phase1", "phase2", "phase3", "phase4"]
    phases.forEach(cPhase => {
        const phaseObj = Object(this.profile[cPhase])
        this.set(`profile.${cPhase}.project_url`, deffy(phaseObj.project_url, ""))
        this.set(`profile.${cPhase}.github_repo_url`, deffy(phaseObj.github_repo_url, ""))
        this.set(`profile.${cPhase}.score_technical`, deffy(phaseObj.score_technical, 0))
        this.set(`profile.${cPhase}.score_info_viz`, deffy(phaseObj.score_info_viz, 0))
        this.set(`profile.${cPhase}.score_novelty`, deffy(phaseObj.score_novelty, 0))
        this.set(`profile.${cPhase}.score_total`, deffy(phaseObj.score_total, 0))
    })
    next()
})
