const getTopic = require("../_");

exports.get = (lien, cb) => {
    const user = Bloggify.services.session.isAuthenticated(lien);
    if (!user) {
        return lien.next();
    }
    getTopic(lien, (err, data) => {
        if (err) { return cb(err); }
        if (data.topic.author._id.toString() === user._id || Bloggify.services.session.isAdmin(user)) {
            return cb(null, data);
        }
        lien.next();
    });
};

exports.post = (lien, cb) => {
   const user = Bloggify.services.session.getUser(lien);
   if (!user) { return lien.next(); }
   const filters = {
      _id: lien.params.topicId
   };

   if (!Bloggify.services.session.isAdmin(user)) {
        filters.author = user._id;
        delete lien.data.sticky;
   } else {
        lien.data.sticky = !!lien.data.sticky;
   }

   Bloggify.models.Topic.updateTopic(filters, lien.data, (err, topic) => {
       if (err) {
           return cb(null, {
               err: err
             , topic: lien.data
           });
       }
       lien.redirect(topic.url);
   });
};
