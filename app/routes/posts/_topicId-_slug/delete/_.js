exports.post = (lien, cb) => {
    const user = Bloggify.services.session.getUser(lien);
    if (!user) {
        return lien.next();
    }

    const filters = {
        _id: lien.params.topicId
    };

    if (!Bloggify.services.session.isAdmin(user)) {
         filters.author = user._id;
    }

    Bloggify.models.Topic.remove(filters, (err, count) => {
        if (err) { return lien.apiError(err); }
        lien.redirect("/");
    })
};
