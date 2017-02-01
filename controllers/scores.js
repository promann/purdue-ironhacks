const Session = require("./Session");
const User = require("./User");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    User.model.find((err, users) => {
        if (err) { return cb(err); }
        cb(null, {
            users: users
        });
    });
};
