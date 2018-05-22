// Dependencies
const Bloggify = new (require("bloggify"))({ port: 4242 })
    , Logger = require("cute-logger")
    , pLimit = require("p-limit")

Logger.config.date = true

// Constants
const PHASES = ["phase1", "phase2", "phase3", "phase4", "phase5"]

Bloggify.log("Loading the environment...")

const missingUsersID = ["5adfa247c2bee800145a9945", "5adfa262c2bee800145a994d", "5adfa265c2bee800145a994f", "5adfa267c2bee800145a9950", "5adfa26dc2bee800145a9953", "5adfa273c2bee800145a9958", "5adfa275c2bee800145a995a", "5adfa281c2bee800145a995c", "5adfa287c2bee800145a995e", "5adfa288c2bee800145a995f", "5adfa288c2bee800145a9960", "5adfa288c2bee800145a9961", "5adfa28ec2bee800145a9963", "5adfa298c2bee800145a9966", "5adfa2a4c2bee800145a9968", "5adfa2aec2bee800145a9969", "5adfa2d2c2bee800145a996a", "5adfa2e4c2bee800145a996c", "5adfa2f2c2bee800145a996d", "5adfa301c2bee800145a996f", "5adfa306c2bee800145a9970", "5adfa30bc2bee800145a9972", "5adfa3bbc2bee800145a997a", "5adfa3d3c2bee800145a997c", "5adfa619c2bee800145a9991", "5adfa67ac2bee800145a999a", "5adfa6bbc2bee800145a999e", "5adfb871c2bee800145aa3e3", "5adfcb57c2bee800145aa3f2", "5adfd3b3c2bee800145aa3f5", "5adfd672c2bee800145aa3f6", "5adfe6caef7dd40014dd1749", "5adfe715ef7dd40014dd174a", "5ae0c4b1ef7dd40014dd1797", "5ae0d4afef7dd40014dd179f", "5ae0ec66ef7dd40014dd1811", "5ae1c91169a1d90014344e71", "5ae1cd7369a1d90014344e72", "5ae1ef6569a1d90014344e8f", "5ae23ffc41bd100014cc3762", "5ae2430341bd100014cc3805", "5ae2491e41bd100014cc3dea", "5ae2608a41bd100014cc45e7", "5ae2749d41bd100014cc45e9", "5ae3b8758a7556001409dfeb", "5ae471368a7556001409dff2", "5ae69af9dfabf20014c2c3aa", "5ae760fbdfabf20014c2c3c3", "5ae774d034927a001430228a", "5ae78a9b34927a001430229b", "5ae86e2b34927a00143027b0", "5ae91c81aefc6e0014f13aa0", "5ae97b0aaefc6e0014f13aaa", "5ae9a737aefc6e0014f13aad", "5aeaebcfecdb0b0014d708e4", "5aeaf633ecdb0b0014d708e9", "5aeb0283ecdb0b0014d708ee", "5aef59b13bd4f4001477e58b"]

// Listen for Bloggify to load
Bloggify.ready(err => {
    if (err) { return Bloggify.log(err) }

    Bloggify.log("Finding the users...")

    // 1. Get the list of missing users
    for (var i = 0; i < missingUsersID.length; i++) {
      Bloggify.models.User.find({
        _id: missingUsersID[i]
      }).then(user => {
        const projectName = "webapp_phase3"
        return Bloggify.models.Project.findOne({
          username: user[0].username,
          name: projectName
        }).then(_project => {
          project = new Bloggify.models.Project(_project)
          console.log("---")
          console.log(user[0].username)
          console.log(project)
          console.log("---")
          return project.syncGitHubRepository("Restore")
        }).then(result => {
          console.log(result)
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
