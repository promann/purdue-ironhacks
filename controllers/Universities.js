const Bloggify = require("bloggify")
    , unique = require("unique-random-range")
    , forEach = require("iterate-object")
    , Settings = require("./Settings")
    , User = require("./User")
    ;

const UNIVERSITIES = {
    // Gold
    purdue: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_brTBahMpVU9CFYV"
      , label: "Purdue"
      , hackatons: [ {} ]
      , start_date: null
    }

    // Black
  , bogota: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_2b1fTpmPhtyMRAV"
      , label: "Bogota"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
    }

    // Green
  , platzi: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_4ZoALAMqPjrTUlT"
      , label: "Platzi"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
    }
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
            UNIVERSITIES[name].start_date = uni.start_date;
        });
    });
    cb && cb();
};

Settings.model.addHook("post", "save", update);
update();

function generateGetHackId(uni, name) {
    return cb => {
        switch (name) {
            // For Purdue we have just one hack id
            case "purdue":
                return cb(0);
            default:
                User.model.aggregate([{
                    $match: { "profile.university": name }
                }, {
                    $group: {
                        _id: "$profile.hack_id",
                        total: { $sum: 1 }
                    }
                }], (err, docs) => {
                    if (err) { return cb(0); }
                    const ids = [
                        0,
                        0,
                        0
                    ]
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
                break;
        }
    };
}

forEach(UNIVERSITIES, (c, name) => {
    c.getHackId = generateGetHackId(c, name);
});

module.exports = UNIVERSITIES;
