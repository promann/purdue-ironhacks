exports.get = lien => {
    lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
};

exports.post = (lien, cb) => {
    const user = Bloggify.services.session.getUser(lien);
    if (!user) { return lien.next(); }
    Bloggify.models.Topic.toggleVote({
        user: user,
        topic: lien.params.topicId
    }, err => {
        if (err) {
            return cb(null, {
                err: err
            });
        }
        lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
    });
};
