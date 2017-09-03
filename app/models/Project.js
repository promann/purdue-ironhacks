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
})

ProjectSchema.virtual("url").get(function () {
   return `/users/${this.username}/projects/${this.name}`
})

const Project = module.exports = Bloggify.db.model("Project", ProjectSchema)
