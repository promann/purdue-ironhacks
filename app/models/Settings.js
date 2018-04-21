const ul = require("ul")
    , forEach = require("iterate-object")
    , schedule = require("node-schedule")
    , Daty = require("daty")

const ID = "0".repeat(24)
const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_START_DATE = new Daty().setDate(15).setMonth(2)
const DEFAULT_END_DATE = DEFAULT_START_DATE.clone().add(10, "months")

const SettingsSchema = new Bloggify.db.Schema({
    settings: Object
})


const SURVEY_URL = "https://purdue.ca1.qualtrics.com/jfe/form/SV_23GkqPCNMdqsdo1"
const UNAL_SURVEY_URL = ""
const CUPL_SURVEY_URL = "https://purdue.ca1.qualtrics.com/jfe/form/SV_5z2DMohEhCpwYf3"

const HACK_TYPES = {
  
    purdue: {
        survey: SURVEY_URL
      , label: "Purdue"
      , display_label: "Purdue Gold IronHacks Fall " + CURRENT_YEAR
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }

  , bogota: {
        survey: SURVEY_URL
      , label: "Honors"
      , display_label: "Purdue – Gold IronHacks Fall" + CURRENT_YEAR
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }

  , unal: {
        survey: SURVEY_URL
      , label: "UNAL"
      , display_label: "Purdue – UNAL Gold IronHacks " + CURRENT_YEAR
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }

    // Gold
  , purdue_spring_2018: {
        survey: SURVEY_URL
      , label: "Purdue Spring 2018"
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }

  , purdue_summer_2018: {
        survey: SURVEY_URL
      , label: "Purdue Summer 2018"
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }

  , purdue_fall_2018: {
        survey: SURVEY_URL
      , label: "Purdue Fall 2018"
      , start_date: null
      , end_date: null
      , subforums_count: 0
    }
    
  , CUPL_spring_2018: {
        survey: SURVEY_URL
      , label: "CUPL Spring 2018"
      , start_date: null
      , end_date: null
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
    const defaultHackTypes = {}
    forEach(HACK_TYPES, (hack, hackName) => {
        defaultHackTypes[hackName] = {
            phase: "phase1",
            subforums_count: 0,
            start_date: DEFAULT_START_DATE._,
            end_date: DEFAULT_END_DATE._
        }
    })
    return Settings.getSettings().then(settings => {
        if (!settings) {
            return new Settings({
                _id: ID
              , settings: {
                    hack_types: defaultHackTypes
                }
            }).save()
        } else {
            const updatedHackTypes = ul.deepMerge(settings.toObject().settings.hack_types, defaultHackTypes)
            settings.set("settings.hack_types", updatedHackTypes)
            return settings.save()
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
        hType.getHackId().then(uHackId => {
            return Bloggify.models.User.findOne({
                _id: cDoc._id
            }).then(user => {
                user.set("profile.hack_id", uHackId)
                return user.save()
            })
        }).then(() => {
            usersCursor.resume()
        }).catch(err => Bloggify.log(err))
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
        if (!doc || !HACK_TYPES.purdue.getHackId) {
            Bloggify.log("Settings not found. Trying again in a second.")
            return setTimeout(updateSettingsInternally, 1000)
        }

        forEach(doc.settings.hack_types, (hType, name) => {
            let thisHackType = HACK_TYPES[name]
            if (!thisHackType) { return }
            thisHackType.start_date = hType.start_date
            thisHackType.end_date = hType.end_date
            thisHackType.hack_start_date = hType.hack_start_date
            thisHackType.phase = hType.phase
            thisHackType.next_phase_date = hType.next_phase_date
            thisHackType.show_results_date = hType.show_results_date
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
