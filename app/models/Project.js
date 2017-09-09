const path = require("path")

const ProjectSchema = new Bloggify.db.Schema({
    username: {
        type: String,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    description: String,
    fork: String,
    phase: String
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    } 
})


ProjectSchema.statics.getGitHubRepoName = (username, projectName, year) => {
    return `IH-Project-${year}-${username}_${projectName}`
}

ProjectSchema.methods.syncGitHubRepository = function (commitMessage) {
    return Bloggify.services.projects.syncGitHubRepository(this, commitMessage)
}


ProjectSchema.methods.downloadFiles = function (projectPath) {
    return Bloggify.services.projects.downloadFiles(this, projectPath)
}

ProjectSchema.virtual("url").get(function () {
   return `/users/${this.username}/projects/${this.name}`
})


ProjectSchema.virtual("local_patb").get(function () {
   return path.resolve(Bloggify.options.root, "repos", project.github_repo_name)
})




ProjectSchema.virtual("github_repo_name").get(function () {
   return Project.getGitHubUrl(this.username, this.name, this.created_at.getFullYear())
})


ProjectSchema.virtual("github_repo_url").get(function () {
   return `https://${process.env.GITHUB_ADMIN_TOKEN}@github.com/${process.env.GITHUB_PROJECTS_ORGANIZATIONthis}/${this.github_repo_name}`
})

const Project = module.exports = Bloggify.db.model("Project", ProjectSchema)
