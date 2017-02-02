const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

const getTopic = require("./index");

exports.get = (lien, cb) => {
    const user = Session.isAuthenticated(lien);
    if (!user) {
        return lien.next();
    }
    getTopic(lien, (err, data) => {
        if (err) { return cb(err); }
        if (data.topic.author._id.toString() === user._id) {
            return cb(null, data);
        }
        lien.next();
    });
};

exports.post = (lien, cb) => {
   const user = Session.getUser(lien);
   if (!user) { return lien.next(); }
   Topic.update({
      _id: lien.params.topicId
    , author: user._id
   }, lien.data, (err, topic) => {
       debugger
       if (err) {
           return cb(null, {
               err: err
             , topic: lien.data
           });
       }
       lien.redirect(Topic.getUrl(topic));
   });
};
