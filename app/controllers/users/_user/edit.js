const Session = require("../../Session")
    , User = require("../../User")
    , userIndex = require("./index")
    ;

exports.get = (lien, cb) => {
    return lien.next();
    const user = Session.getUser(lien);
    if (!user) { return lien.next(); }
    userIndex.get(lien, (err, data) => {
        if (err) { return cb(err); }
        let profile = data.profile;
        if (!profile || profile._id.toString() !== user._id) {
            return lien.next();
        }
        cb(null, {
            profile: profile
        });
    });
};

exports.post = (lien, cb) => {
    return lien.next();
    const user = Session.getUser(lien);
    if (!user) {
        return lien.next();
    }

    const updateData = {
        bio: lien.data.bio
      , twitter: lien.data.twitter
      , website: lien.data.website
    };

    User.update({
        _id: user._id
    }, {
        profile: updateData
    }, (err, data) => {
        lien.redirect(User.getProfileUrl(user));
    })
};
