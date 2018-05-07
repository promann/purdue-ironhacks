// Dependencies
const Bloggify = new (require("bloggify"))({ port: 4242 })
    , Logger = require("cute-logger")
    , pLimit = require("p-limit")

Logger.config.date = true

// Constants
const PHASES = ["phase1", "phase2", "phase3", "phase4", "phase5"]

Bloggify.log("Loading the environment...")

// Listen for Bloggify to load
Bloggify.ready(err => {
    if (err) { return Bloggify.log(err) }

    Bloggify.log("Finding the users...")

    // 1. Get the list of users
    Bloggify.models.User.find({
        //username: ""
    }).then(users => {
        const limitProjectCreation = pLimit(10)
        // 2. For each user
        return Promise.all(users.map((user, index) => {
            // 3. Create the 3 projects (phase2, 3, 4)
            return Promise.all(PHASES.map(phase => {
                return limitProjectCreation(() => {
                    Bloggify.log(`[${index + 1}/${users.length}] Creating the project for @${user.username}, ${phase}`)
                    const projectName = `webapp_${phase}`
                    return Bloggify.models.Project.findOne({
                        username: user.username,
                        name: projectName
                    }).then(project => {
                        return project.destroyProject()
                    }).then(() => {
                        return Bloggify.services.projects.create({
                          name: projectName
                        , username: user.username
                        , phase
                        , id: user._id
                        })
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
