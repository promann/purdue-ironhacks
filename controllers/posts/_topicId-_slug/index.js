const Topic = require("../../Topic");

module.exports = (lien, cb) => {
   Topic.get({
      _id: lien.params.topicId
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
