const ul = require("ul")
const ID = "0".repeat(24);

module.exports = class Settings {
    static set (data, cb) {
        SettingsModel.findOne({ _id: ID }, (err, settings) => {
            if (err) { return cb(err); }
            settings.set({
                settings: ul.deepMerge(data, settings.toObject().settings)
            });
            settings.save(cb);
        });
    }
    static get (cb) {
        return SettingsModel.findOne({ _id: ID }, cb);
    }
    static ensure () {
        module.exports.get().then(settings => {
            if (!settings) {
                new SettingsModel({
                    _id: ID
                  , settings: {
                        phase: "phase1"
                    }
                }).save()
            }
        });
    }
};

let SettingsModel = null;
setTimeout(function() {
    module.exports.model = SettingsModel = Bloggify.models.Settings
    module.exports.ensure();
}, 1000);
