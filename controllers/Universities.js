const unique = require("unique-random-range");
const forEach = require("iterate-object");
const Settings = require("./Settings");

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
