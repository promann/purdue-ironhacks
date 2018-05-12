const UsedLibrariesSchema = new Bloggify.db.Schema({
    actor: String,
    hack_type: String,
    owner_name: String,
    phase: Number,
    white_list: Object,
    black_list: Object,
})


UsedLibrariesSchema.statics.record = data => {
    return UsedLibraries(data).save()
}


const UsedLibraries = module.exports = Bloggify.db.model("UsedLibraries", UsedLibrariesSchema)