const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.get = lien => {
    lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
};

exports.post = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) { return lien.next(); }
    if (lien.data.toggleVote) {
        Topic.toggleCommentVote({
            user: user._id,
            comment: lien.data.comment
        }, (err, data) => {
            if (err) {
                return cb(null, {
                    err: err
                });
            }
            cb(null, {});
        });
        return;
    }
    Topic.postComment({
        author: user._id,
        body: lien.data.body,
        topic: lien.params.topicId
    }, (err, data) => {
        if (err) {
            return cb(null, {
                err: err
            });
        }
        lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
    });
};
