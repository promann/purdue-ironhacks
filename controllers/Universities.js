const Bloggify = require("bloggify")
    , unique = require("unique-random-range")
    , forEach = require("iterate-object")
    , Settings = require("./Settings")
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

const update = () => {
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
};
Settings.model.schema.post("save", update);
update();

forEach(UNIVERSITIES, c => {
    c.getHackId = unique(0, c.hackatons.length - 1);
});

module.exports = UNIVERSITIES;
