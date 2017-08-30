const ul = require("ul")
    , forEach = require("iterate-object")

const ID = "0".repeat(24)
const FIFTEENTH_OF_MARCH = new Date(new Date().getFullYear(), 2, 15)

const SettingsSchema = new Bloggify.db.Schema({
    settings: Object
})

const HACK_TYPES = {
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
}

SettingsSchema.statics.setSettings = data => {
    return Settings.getSettings().then(settings => {
        settings.set({
            settings: ul.deepMerge(data, settings.toObject().settings)
        })
        return settings.save()
    })
}

SettingsSchema.statics.getSettings = () => {
    return Settings.findOne({ _id: ID })
}

SettingsSchema.statics.ensure = () => {
    return Settings.getSettings().then(settings => {
        if (!settings) {
            return new Settings({
                _id: ID
              , settings: {
                    hack_types: {
                        purdue: { phase: "phase1", subforums_count: 0, start_date: null }
                      , bogota: { phase: "phase1", subforums_count: 0, start_date: FIFTEENTH_OF_MARCH }
                      , platzi: { phase: "phase1", subforums_count: 0, start_date: FIFTEENTH_OF_MARCH }
                    }
                }
            }).save()
        }
    })
}

const assignHackIdsToUsers = hType => {
    const usersCursor = Bloggify.models.User.find({
        "profile.hack_id": null,
        "profile.hack_type": hType.name
    }).cursor()

    usersCursor.on("data", cDoc => {
        usersCursor.pause()
        hType.getHackId(uHackId => {
            Bloggify.models.User.update({
                _id: cDoc._id
            }, {
                profile: {
                    hack_id: uHackId
                }
            }, (err, data) => {
                if (err) { Bloggify.log(err); }
                usersCursor.resume()
            })
        })
    })

    usersCursor.on("error", err => {
        Bloggify.log(err)
    })

    usersCursor.on("end", cDoc => {
        Bloggify.log(`Grouped the studends from ${hType.name}.`)
    })
}

const setScheduleForHackType = name => {
    if (name.name) {
        name = name.name
    }

    let hackTypeObj = HACK_TYPES[name]
    if (hackTypeObj.startSchedule) {
        hackTypeObj.startSchedule.cancel()
    }

    hackTypeObj.startSchedule = schedule.scheduleJob(hackTypeObj.start_date, () => {
        assignHackIdsToUsers(hackTypeObj)
    })
}

const updateSettingsInternally = () => {
    return Bloggify.models.Settings.getSettings().then(doc => {
        if (!doc) {
            Bloggify.log("Settings not found. Trying again in a second.")
            return setTimeout(updateSettingsInternally, 1000)
        }
        forEach(doc.settings.hack_types, (hType, name) => {
            let thisHackType = HACK_TYPES[name]
            thisHackType.start_date = hType.start_date
            thisHackType.hack_start_date = hType.hack_start_date
            thisHackType.next_phase_date = hType.next_phase_date
            thisHackType.subforums_count = hType.subforums_count
            if (new Date() > thisHackType.start_date) {
                if (thisHackType.startSchedule) {
                    thisHackType.startSchedule.cancel()
                }
                assignHackIdsToUsers(thisHackType)
            } else {
                setScheduleForHackType(thisHackType)
            }
        })
    })
}

SettingsSchema.post("save", updateSettingsInternally);
SettingsSchema.statics.updateSettingsInternally = updateSettingsInternally;

const Settings = module.exports = Bloggify.db.model("Settings", SettingsSchema)

Settings.HACK_TYPES = HACK_TYPES

Settings.ensure()
