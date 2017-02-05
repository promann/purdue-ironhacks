const User = require("../../User");
const Session = require("../../Session");

exports.get = (lien, cb) => {
    const authUser = Session.getUser(lien);
    if (!authUser) {
        return lien.next();
    }
    User.get({
        filters: {
            username: lien.params.user,
            "profile.university": authUser.profile.university,
            "profile.hack_id": authUser.profile.hack_id
        }
      , fields: {
            password: 0
        }
    }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return lien.next();
        }
        user = user.toObject();
        user.url = User.getProfileUrl(user);
        cb(null, {
            profile: user
        });
    });
};
