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
    lien.data.votes = 0;

    User.createTopic(lien.data, (err, topic) => {
        if (err) {
            return cb(null, {
                err: err
            });
        }
        lien.redirect(Topic.getUrl(topic));
    });
};
