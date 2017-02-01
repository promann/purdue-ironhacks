const Session = require("./Session");
const User = require("./User");

const ADMINS = ["IonicaBizau"];

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user || !ADMINS.includes(user.username)) {
        return lien.redirect("/");
    }
    if (lien.method === "post") {
        Promise.all(lien.data.users.map(c => {
            return User.model.update({
                _id: c._id
            }, {
                $set: {
                    "profile.project_url": c.update.project_url
                  , "profile.github_repo_url": c.update.github_repo_url
                  , "profile.score_technical": +c.update.score_technical || 0
                  , "profile.score_info_viz": +c.update.score_info_viz || 0
                  , "profile.score_novelty": +c.update.score_novelty || 0
                }
            });
        })).then(c => {
            lien.apiMsg({ success: true });
        }).catch(e => {
            lien.apiError(e);
        });
    } else {
        User.model.find({}, {
            password: 0
        }, (err, users) => {
            if (err) { return cb(err); }
            users = users.map(c => c.toObject());
            cb(null, {
                users: users
            });
        });
    }
};
