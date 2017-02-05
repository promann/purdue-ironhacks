const Session = require("./Session");
const User = require("./User");
const Settings = require("./Settings");
const forEach = require("iterate-object");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);

    if (!user) {
        return lien.redirect("/");
    }

    User.get({
        filters: {
            _id: user._id
        }
    }, (err, dbUser) => {
        if (err) { return cb(err); }
        if (dbUser.role !== "admin" && dbUser.username !== process.env.ADMIN_USERNAME) {
            return lien.redirect("/");
        }

        if (lien.method === "post") {
            forEach(lien.data.universities, uni => {
                uni.start_date = new Date(uni.start_date);
            });
            Settings.set({
                phase: lien.data.phase
              , universities: lien.data.universities
            });

            Promise.all(lien.data.users.map(c => {
                const roleValue = c.update.role;
                delete lien.data.role;
                return User.update({
                    _id: c._id
                }, {
                    role: roleValue,
                    profile: {
                        [lien.data.phase]: {
                            "project_url": c.update.project_url
                          , "github_repo_url": c.update.github_repo_url
                          , "score_technical": +c.update.score_technical || 0
                          , "score_info_viz": +c.update.score_info_viz || 0
                          , "score_novelty": +c.update.score_novelty || 0
                          , "score_custom": c.update.score_custom && +c.update.score_custom
                        }
                    }
                });
            })).then(c => {
                lien.apiMsg({ success: true });
            }).catch(e => {
                lien.apiError(e);
            });
        } else {
            Settings.get((err, options) => {
                if (err) { return cb(err); }
                User.model.find({}, {
                    password: 0
                }, (err, users) => {
                    if (err) { return cb(err); }
                    users = users.map(c => c.toObject());
                    cb(null, {
                        users: users
                      , settings: options.settings
                    });
                });
            });
        }
    });
};
