const ul = require("ul")
    , regexEscape = require("regex-escape")
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
        const Topic = require("./Topic");
        Topic.create(data, cb);
    }
}

let UserModel = null;
setTimeout(function() {
    debugger
    User.model = UserModel = Bloggify.models.User
}, 1000);

module.exports = User;
