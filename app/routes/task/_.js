module.exports = (lien, cb) => {
    const user = Bloggify.services.session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    cb();
};
