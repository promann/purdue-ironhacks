const Bloggify = require("bloggify")
    , unique = require("unique-random-range")
    , forEach = require("iterate-object")
    , Settings = require("./Settings")
    , User = require("./User")
    , schedule = require("node-schedule")
    ;

const UNIVERSITIES = {
    // Gold
    purdue: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_brTBahMpVU9CFYV"
      , label: "Purdue"
      , hackatons: [ {} ]
      , start_date: null
      , subforums_count: 0
    }

    // Black
  , bogota: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_2b1fTpmPhtyMRAV"
      , label: "Bogota"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
      , subforums_count: 0
    }

    // Green
  , platzi: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_4ZoALAMqPjrTUlT"
      , label: "Platzi"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
      , subforums_count: 0
    }
};

forEach(UNIVERSITIES, (c, name) => {
    c.name = name;
});

const assignHackIdsToUsers = uni => {
    const usersCursor = User.model.find({
        "profile.hack_id": null,
        "profile.university": uni.name
    }).cursor();

    usersCursor.on("data", cDoc => {
        usersCursor.pause();
        uni.getHackId(uHackId => {
            User.update({
                _id: cDoc._id
            }, {
                profile: {
                    hack_id: uHackId
                }
            }, (err, data) => {
                if (err) { Bloggify.log(err); }
                usersCursor.resume();
            });
        });
    });

    usersCursor.on("error", err => {
        Bloggify.log(err);
    });

    usersCursor.on("end", cDoc => {
        Bloggify.log(`Grouped the studends from ${uni.name}.`);
    });
};

const update = cb => {
    Settings.get((err, doc) => {
        if (err) {
            return Bloggify.log(err);
        }
        if (!err && !doc) {
            Bloggify.log("Settings not found. Trying again in a second.");
            return setTimeout(update, 1000);
        }
        forEach(doc.settings.universities, (uni, name) => {
            let thisHackType = UNIVERSITIES[name];
            thisHackType.start_date = uni.start_date;
            thisHackType.subforums_count = uni.subforums_count;
            if (new Date() > thisHackType.start_date) {
                if (thisHackType.startSchedule) {
                    thisHackType.startSchedule.cancel();
                }
                assignHackIdsToUsers(thisHackType);
            } else {
                setScheduleForHackType(thisHackType);
            }
        });
    });
    cb && cb();
};

const setScheduleForHackType = name => {
    if (name.name) {
        name = name.name;
    }

    let hackTypeObj = UNIVERSITIES[name];
    if (hackTypeObj.startSchedule) {
        hackTypeObj.startSchedule.cancel();
    }

    hackTypeObj.startSchedule = schedule.scheduleJob(hackTypeObj.start_date, () => {
        assignHackIdsToUsers(hackTypeObj);
    });
};

Settings.model.addHook("post", "save", update);
update();

function generateGetHackId(uni, name) {
    return cb => {
        User.model.aggregate([{
            $match: {
                "profile.hack_id": { $ne: null },
                "profile.university": name
            }
        }, {
            $group: {
                _id: "$profile.hack_id",
                total: { $sum: 1 }
            }
        }], (err, docs) => {
            if (err) { return cb(0); }
            const ids = Array(uni.subforums_count + 1).fill(0);
            docs.forEach(c => {
                ids[c._id] = c.total;
            });
            let minId = 0;
            let min = ids[minId];
            ids.forEach((count, index) => {
                if (count < min) {
                    minId = index;
                    min = ids[minId];
                }
            });
            cb(minId);
        });
    };
}

forEach(UNIVERSITIES, (c, name) => {
    c.getHackId = generateGetHackId(c, name);
});

module.exports = UNIVERSITIES;
