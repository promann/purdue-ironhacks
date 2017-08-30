module.exports = (lien, cb) => {
    const user = Bloggify.services.session.getUser(lien);
    if (!user) {
        lien.setSessionData({
            return_to: lien.pathname
        });
        return lien.redirect("/login");
    }

    const filters = {
        _id: lien.params.topicId
    };

    if (!Bloggify.services.session.isAdmin(user)) {
        filters["metadata.hack_type"] = user.profile.hack_type;
        filters["metadata.hack_id"] = user.profile.hack_id;
    }

    Bloggify.models.Topic.getTopic(filters, (err, topic) => {
       if (err && err.name === "CastError") {
           err = null;
           topic = null;
       }
       if (!topic) {
            return lien.next();
       }
       if (topic.slug !== lien.params.slug) {
           return lien.redirect(topic.url);
       }
       Bloggify.models.Topic.populateTopic(topic.toObject()).then(topic => {
           cb(null, {
               topic: topic
           });
       }).catch(e => cb(e));
   });
};
