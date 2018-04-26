const GeneralScoreOSSchema = new Bloggify.db.Schema({
    semester: String,
    group_id: String,
    phase_id: Number,
    hack_id: Number,
    user_id: String,
    score: String,
    hacker_id: Number,
})


GeneralScoreOSSchema.statics.record = data => {
    return GeneralScoreOS(data).save()
}

const GeneralScoreOS = module.exports = Bloggify.db.model("GeneralScoreOS", GeneralScoreOSSchema)