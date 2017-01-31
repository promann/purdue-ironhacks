const Session = require("./Session");
const User = require("./User");

const ADMINS = ["IonicaBizau"];

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user || !ADMINS.includes(user.username)) {
        return lien.redirect("/");
    }
    if (lien.method === "post") {
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
