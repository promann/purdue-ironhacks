const User = require("../../User");

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
        user.url = User.getProfileUrl(user);
        delete user.password;
        cb(null, {
            profile: user
        });
    });
};
