const User = require("../User");

exports.get = (lien, cb) => {
    User.get({
        username: lien.params.user
    }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return lien.next();
        }
        user = user.toObject();
        delete user.password;
        cb(null, {
            user: user
        });
    });
};
