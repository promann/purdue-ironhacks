const Topic = require("./Topic");

let UserModel = null;
setTimeout(function() {
    exports.model = UserModel = Bloggify.models.User
}, 1000);

module.exports = class User {

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
        UserModel.findOne({
            $or: [
                { username: new RegExp(data.username, "i") },
                { email: data.email }
            ]
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

    static update (data, cb) {
        UserModel.findOne(data.email, (err, user) => {
            if (err) { return cb(err); }
            if (!user) {
                return cb(new Error("User not found."));
            }
            user.set(data.update);
            user.save(cb);
        });
    }

    static createTopic (data, cb) {
        Topic.create(data, cb);
    }
};
