const Topic = require("./Topic")
    , ul = require("ul")
    , regexEscape = require("regex-escape")
    ;

let UserModel = null;
setTimeout(function() {
    exports.model = UserModel = Bloggify.models.User
}, 1000);

module.exports = class User {

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
        const $or = []
        if (data.email) {
            $or.push({ email: data.email });
        }
        if (data.username) {
            $or.push({ username: new RegExp("^" + regexEscape(data.username) + "$", "i") });
        }
        UserModel.findOne({
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

    static update (id, data, cb) {
        UserModel.findOne({
            _id: id
        }, (err, user) => {
            if (err) { return cb(err); }
            if (!user) {
                return cb(new Error("User not found."));
            }
            let update = ul.deepMerge(data, user.toObject());
            delete update._id;
            user.set(update);
            user.save(cb);
        });
    }

    static createTopic (data, cb) {
        Topic.create(data, cb);
    }
};
