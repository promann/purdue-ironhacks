const Bloggify = require("bloggify");
const csv = require("fast-csv");
const moment = require("moment");
const flatten = require("obj-flatten");

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

exports.topics = () => {
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
            if (response[0]) {
                const topic = response[0].toObject()
                    , author = response[1].toObject()
                    , actor = response[2].toObject()
                    ;

                csvStream.write({
                    click_date: doc.created_at.format("YYYY-MM-DD"),
                    click_time: doc.created_at.format("hh:mm a"),
                    url: `${Bloggify.options.metadata.domain}/posts/${topic._id}-${topic.slug}`,
                    phase: doc.metadata.phase,
                    post_title: topic.title,
                    post_author: author.username,
                    post_author_email: author.email,
                    clicker_username: actor.username,
                    clicker_email: actor.email
                });
            }
            readStream.resume();
        }).catch(e => {
            console.error(e.stack);
        });
    }).on("close", () => {
        csvStream.end();
    });
    return csvStream;
};

exports.scores = () => {
    const csvStream = csv.format({
        headers: true
    });

    const readStream = Stats.model.find({
        $or: [{
            event: "click-github-repo-url",
        }, {
            event: "click-project-url"
        }, {
            event: "score-click"
        }]
    }).stream();

    readStream.on("data", doc => {
        doc = doc.toObject()
        doc.created_at = moment(doc.created_at)
        readStream.pause();
        Promise.all([
            User.model.findOne({ _id: doc.metadata.hacker_id })
          , User.model.findOne({ _id: doc.actor })
        ]).then(response => {
            const hacker = response[0].toObject()
                , actor = response[1].toObject()
                ;

            csvStream.write({
                click_date: doc.created_at.format("YYYY-MM-DD"),
                click_time: doc.created_at.format("hh:mm a"),
                event_type: doc.event,
                url: doc.metadata.url || "",
                phase: doc.metadata.phase,
                hacker_username: hacker.username,
                hacker_email: hacker.email,
                clicker_username: actor.username,
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

exports.users = filters => {
    const csvStream = csv.format({
        headers: true
    });

    const query = {};

    if (filters.hackType && filters.hackType !== "All") {
        query["profile.university"] = filters.hackType;
    }

    if (filters.hackId && filters.hackId !== "All") {
        query["profile.hack_id"] = filters.hackId;
    }

    const readStream = User.model.find(query, {
        password: 0,
        "profile.bio": 0,
        "profile.github_username": 0,
        "profile.full_name": 0,
        "profile.picture": 0,
        "profile.website": 0,
        "role": 0,
    }).stream();

    readStream.on("data", doc => {
        doc = doc.toObject()
        delete doc.__v;
        debugger
        csvStream.write(flatten(doc));
    }).on("close", () => {
        debugger
        csvStream.end();
    });
    return csvStream;
};
