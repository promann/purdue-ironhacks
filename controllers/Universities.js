//const FIFTEENTH_OF_MARCH = new Date(2017, 2, 15);
const FIFTEENTH_OF_MARCH = new Date(2017, 0, 31, 19, 38);
const unique = require("unique-random-range");
const forEach = require("iterate-object");

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
      , start_date: FIFTEENTH_OF_MARCH
    }

    // Green
  , platzi: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_4ZoALAMqPjrTUlT"
      , label: "Platzi"
      , hackatons: [ {}, {}, {} ]
      , start_date: FIFTEENTH_OF_MARCH
    }
};


forEach(UNIVERSITIES, c => {
    c.getHackId = unique(0, c.hackatons.length - 1);
});



module.exports = UNIVERSITIES;

