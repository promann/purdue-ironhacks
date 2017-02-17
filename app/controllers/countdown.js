const Session = require("./Session");
const Universities = require("./Universities");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    cb(null, {
        user: user,
        university: Universities[user.profile.university]
    });
};
