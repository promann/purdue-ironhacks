const Topic = require("../../Topic");
const Session = require("../../Session");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
   if (!user) {
       return lien.next();
   }
   Topic.get({
      _id: lien.params.topicId
    , "metadata.university": user.profile.university
    , "metadata.hack_id": user.profile.hack_id
   }, (err, topic) => {
       if (err && err.name === "CastError") {
           err = null;
           topic = null;
       }
       if (err) { return cb(err); }
       if (!topic) {
            return lien.next();
       }
       if (topic.slug !== lien.params.slug) {
           return lien.redirect(Topic.getUrl(topic));
       }
       Topic.populate(topic.toObject()).then(topic => {
           cb(null, {
               topic: topic
           });
       }).catch(e => cb(e));
   });
};
