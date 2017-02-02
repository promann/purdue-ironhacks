const Bloggify = require("bloggify")
    , ul = require("ul")
    ;

const ID = "0".repeat(24);
const FIFTEENTH_OF_MARCH = new Date(new Date().getFullYear(), 2, 15);

class Settings {
    static set (data, cb) {
        Settings.model.findOne({ _id: ID }, (err, settings) => {
            if (err) { return cb(err); }
            settings.set({
                settings: ul.deepMerge(data, settings.toObject().settings)
            });
            settings.save(cb);
        });
    }
    static get (cb) {
        return Settings.model.findOne({ _id: ID }, cb);
    }
    static ensure () {
        Settings.get().then(settings => {
            if (!settings) {
                new Settings.model({
                    _id: ID
                  , settings: {
                        phase: "phase1"
                      , universities: {
                            purdue: { start_date: null }
                          , bogota: { start_date: FIFTEENTH_OF_MARCH }
                          , platzi: { start_date: FIFTEENTH_OF_MARCH }
                        }
                    }
                }).save()
            }
        });
    }
};

Settings.model = Bloggify.models.Settings
Settings.ensure();

module.exports = Settings;
