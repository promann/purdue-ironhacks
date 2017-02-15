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

    let universitySlug = user.profile.university
      , hackId = user.profile.hack_id
      ;

    if (Session.isAdmin(user)) {
        if (lien.data.hackId) {
            hackId = lien.data.hackId;
        }
        if (lien.data.university) {
            universitySlug = lien.data.university;
        }
    } else {
        delete lien.data.sticky;
    }

    lien.data.metadata = {
        university: universitySlug,
        hack_id: +hackId
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
