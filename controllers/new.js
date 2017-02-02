const User = require("./User");
const Session = require("./Session");
const Topic = require("./Topic");

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.data = {
        body: "",
        title: ""
    };
    cb();
};

exports.post = (lien, cb) => {
    const user = Session.isAuthenticated(lien);
    if (!user) {
        return lien.redirect("/");
    }

    lien.data.author = user._id;
    lien.data.created_at = new Date();
    lien.data.votes = [];
    lien.data.metadata = {
        university: user.profile.university,
        hack_id: user.profile.hack_id
    };

    User.createTopic(lien.data, (err, topic) => {
        if (err) {
            return cb(null, {
                err: err
              , post_data: lien.data
            });
        }
        lien.redirect(Topic.getUrl(topic));
    });
};
