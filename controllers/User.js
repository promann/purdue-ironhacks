const ul = require("ul")
    , regexEscape = require("regex-escape")
    , deffy = require("deffy")
    ;

class User {

    static getProfileUrl (user) {
        return `/users/${user.username}`;
    }

    static auth (data, cb) {
        User.get(data, (err, user) => {
            if (err) { return cb(err); }
            if (!user) { return cb(new Error("User not found.")); }
            // TODO HASH
            if (user.password !== data.password) {
                cb(new Error("Incorrect password."));
            } else {
                cb(null, user);
            }
        });
    }

    static get (data, cb) {
        if (data.filters) {
            return UserModel.findOne(data.filters, data.fields, cb);
        }
        const $or = [];
        if (data.email) {
            $or.push({ email: data.email });
        }
        if (data.username) {
            $or.push({ username: new RegExp("^" + regexEscape(data.username) + "$", "i") });
        }
        return UserModel.findOne({
            $or: $or
        }, cb);
    }

    static create (data, cb) {
        UserModel.count({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        }, (err, exists) => {
            if (err) { return cb(err); }
            if (exists) {
                return cb(new Error("Email/username is already registered."));
            }
            new UserModel(data).save(cb);
        });
    }

    static update (filters, data, cb) {
        return UserModel.findOne(filters).then(user => {
            if (!user) {
                throw new Error("User not found.");
            }
            if (user.username === "IonicaBizau") debugger
            let update = ul.deepMerge(data, user.toObject());
            delete update._id;
            user.set(update);
            return user.save(cb);
        });
    }

    static createTopic (data, cb) {
        const Topic = require("./Topic");
        Topic.create(data, cb);
    }
}

let UserModel = null;
setTimeout(function() {
    User.model = UserModel = Bloggify.models.User
    UserModel.schema.pre("save", function (next) {
        const phases = ["phase1", "phase2", "phase3", "phase4"];
        phases.forEach(cPhase => {
            const phaseObj = Object(this.profile[cPhase]);
            this.set(`profile.${cPhase}.project_url`, deffy(phaseObj.project_url, ""));
            this.set(`profile.${cPhase}.github_repo_url`, deffy(phaseObj.github_repo_url, ""));
            this.set(`profile.${cPhase}.score_technical`, deffy(phaseObj.score_technical, 0));
            this.set(`profile.${cPhase}.score_info_viz`, deffy(phaseObj.score_info_viz, 0));
            this.set(`profile.${cPhase}.score_novelty`, deffy(phaseObj.score_novelty, 0));

            if (this.username === "IonicaBizau") debugger
            if (phaseObj.score_custom) {
                total = phaseObj.score_custom;
            } else {
                total = phaseObj.score_technical + phaseObj.score_info_viz + phaseObj.score_novelty
            }

            this.set(`profile.${cPhase}.score_total`, total);
        });
        next();
    });
}, 1000);

module.exports = User;
