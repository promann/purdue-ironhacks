// Dependencies
const Bloggify = new (require("bloggify"))({ port: 4242 })
    , Logger = require("cute-logger")
    , pLimit = require("p-limit")

Logger.config.date = true

// Constants
const PHASES = ["phase1", "phase2", "phase3", "phase4", "phase5"]

Bloggify.log("Loading the environment...")

const missingUsersID = ["5aeb0283ecdb0b0014d708ee"]

// Listen for Bloggify to load
Bloggify.ready(err => {
    if (err) { return Bloggify.log(err) }

    Bloggify.log("Finding the users...")

    // 1. Get the list of missing users
    for (var i = 0; i < missingUsersID.length; i++) {
      Bloggify.models.User.find({
        _id: missingUsersID[i]
      }).then(user => {
        const projectName = "webapp_phase2"
        return Bloggify.models.Project.findOne({
          username: user[0].username,
          name: projectName
        }).then(_project => {
          project = new Bloggify.models.Project(_project)
          console.log("---")
          console.log(user[0].username)
          console.log(project)
          console.log("---")
          return project.createGitHubRepository("Init")
        }).then(result => {
          return project.syncGitHubRepository("Rebuild")
        })
      })
    }

    // Bloggify.models.User.find({
    //   _id: "5ade5b7f83fd50001416e793"
    // }).then(user => {
    //   let project = null
    //   const projectName = "webapp_phase2"
    //   return Bloggify.models.Project.findOne({
    //       username: user[0].username,
    //       name: projectName
    //     }).then(_project => {
    //       project = new Bloggify.models.Project(_project)
    //       console.log(project.github_repo_name)
    //       return project.createGitHubRepository()
    //     }).then(something => {
    //       return project.syncGitHubRepository("recall")
    //     }).then(something => {
    //       console.log(something)
    //     })
    // })
})
