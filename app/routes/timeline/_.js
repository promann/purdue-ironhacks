module.exports = (lien, cb) => {
    const HackTypes = Bloggify.services.hack_types
    const user = Bloggify.services.session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    cb(null, {
        user: user,
        hackType: HackTypes[user.profile.hack_type]
    });
};
