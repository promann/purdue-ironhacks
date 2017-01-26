const User = require("./User");
const Session = require("./Session");

exports.get = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.data = {
        email: "",
        password: "",
        username: ""
    };
    cb();
};

exports.post = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    User.create(lien.data, (err, data) => {
        if (err) {
            return cb(null, {
                err: err
            })
        }
        lien.redirect("/login");
    });
};
