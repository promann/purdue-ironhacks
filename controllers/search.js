const Session = require("./Session")
    , Topic = require("./Topic")
    , Comment = require("./Comment")
    ;

exports.get = (lien, cb) => {

    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }

    const isAdmin = Session.isAdmin(user);

    if (lien.query.search) {
        const filters = {
            $text: {
                $search: lien.query.search
            }
        };
        let results = {};
        Promise.all([
            Topic.model.find(filters)
          , Comment.model.find(filters)
        ]).then(data => {
            results.topics = data[0];
            results.comments = data[1].map(c => c.toObject());
            return Promise.all(results.comments.map(cComment => {
                return Topic.model.findOne({ _id: cComment.topic });
            }));
        }).then(topics => {
            //results.comments.forEach((c, i) => {
            //    c.topic = topics[i].toObject();
            //});

            let uniqueTopics = {};
            results.topics.concat(topics).forEach(c => {
                if (!c) { return; }
                if (!isAdmin) {
                    if (c.metadata.university !== user.profile.university ||
                        c.metadata.hack_id !== user.profile.hack_id) {
                        return;
                    }
                }
                uniqueTopics[c._id] = c;
                c.url = Topic.getUrl(c);
            });

            cb(null, { results: Object.keys(uniqueTopics).map(k => uniqueTopics[k]) });
        }).catch(e => {
            cb(e);
        });
    } else {
        cb();
    }
};
