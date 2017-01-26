const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

const getTopic = require("./index");

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.next();
    }
    getTopic(lien, cb);
};

exports.post = (lien, cb) => {
   const user = Session.getUser(lien);
   if (!user) { return lien.next(); }
   Topic.update({
      _id: lien.params.topicId
   }, lien.data, (err, topic) => {
       if (err) {
           return cb({
               err: err
           });
       }
       lien.redirect(Topic.getUrl(topic));
   });
};
