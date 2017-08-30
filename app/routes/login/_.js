exports.get = (lien, cb) => {
    if (Bloggify.services.session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.data = {
        email: "",
        password: ""
    };
    cb();
};

exports.post = (lien, cb) => {
    if (Bloggify.services.session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    Bloggify.models.User.auth(lien.data, (err, user) => {
        if (err) {
            return cb(null, {
                error: err
            });
        }
        lien.startSession({
            user: user
        });
        lien.redirect("/");
    });
};
