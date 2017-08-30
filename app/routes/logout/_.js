exports.get = (lien, cb) => {
    if (!Bloggify.services.session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    cb();
};

exports.post = (lien, cb) => {
    if (!Bloggify.services.session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.destroySession();
    lien.redirect("/");
};
