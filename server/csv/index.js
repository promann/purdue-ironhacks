const Bloggify = require("bloggify");
const csv = require("fast-csv");
const moment = require("moment");

let Stats = null;
let Topic = null;
let User = null;
if (!Bloggify) {
    const Mongoose = require("mongoose");
    Mongoose.connect("mongodb://localhost/bloggify-forum");
    Stats = { model: Mongoose.model("Stat", {}) };
    Topic = { model: Mongoose.model("Topic", {}) };
    User = { model: Mongoose.model("User", {}) };
} else {
    Stats = { model: Bloggify.models.Stats };
    Topic = { model: Bloggify.models.Topic };
    User = { model: Bloggify.models.User };
}

exports.topics = function () {
    const csvStream = csv.format({
        headers: true
    });

    const readStream = Stats.model.find({
        event: "view-topic"
    }).stream();

    readStream.on("data", doc => {
        doc = doc.toObject()
        doc.created_at = moment(doc.created_at)
        readStream.pause();
        Promise.all([
            Topic.model.findOne({ _id: doc.metadata.topic_id })
          , User.model.findOne({ _id: doc.metadata.topic_author })
          , User.model.findOne({ _id: doc.actor })
        ]).then(response => {
            const topic = response[0].toObject()
                , author = response[1].toObject()
                , actor = response[2].toObject()
                ;

            csvStream.write({
                click_date: doc.created_at.format("YYYY-MM-DD"),
                click_time: doc.created_at.format("hh:mm a"),
                url: `/posts/${topic._id}-${topic.slug}`,
                post_title: topic.title,
                post_author: author.username,
                clicker_user: actor._id,
                clicker_email: actor.email
            });
            readStream.resume();
        }).catch(e => {
            console.error(e.stack);
        });
    }).on("close", () => {
        csvStream.end();
    });
    return csvStream;
};
