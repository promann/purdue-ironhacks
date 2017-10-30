// Dependencies
const Bloggify = new (require("bloggify"))({ port: 4242 })
    , Logger = require("cute-logger")
    , pLimit = require("p-limit")

Logger.config.date = true

// Constants
const PHASES = ["phase2", "phase3", "phase4"]

Bloggify.log("Loading the environment...")

// Listen for Bloggify to load
Bloggify.ready(err => {
    if (err) { return Bloggify.log(err) }

    Bloggify.log("Finding the users...")

    // 1. Get the list of users
    Bloggify.models.User.find().then(users => {
        const limitProjectCreation = pLimit(1)
        // 2. For each user
        return Promise.all(users.map((user, index) => {
            // 3. Create the 3 projects (phase2, 3, 4)
            return Promise.all(PHASES.map(phase => {
                return limitProjectCreation(() => {
                    Bloggify.log(`[${index + 1}/${users.length}] Creating the project for @${user.username}, ${phase}`)
                    return Bloggify.services.projects.create({
                        name: `webapp_${phase}`
                        , username: user.username
                        , phase
                    }).then(() => {
                        Bloggify.log(`Created the project for @${user.username}, ${phase}`)
                    }).catch(err => {
                        Bloggify.log(new Error(`Failed to create the project for @${user.username}, ${phase}`))
                        Bloggify.log(err, "error")
                    })
                })
            }))
        }))
    }).then(() => {
        Bloggify.log("Done.")
        process.exit(0)
    }).catch(Bloggify.error)
})
