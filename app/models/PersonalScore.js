const PersonalScoreSchema = new Bloggify.db.Schema({
    semester: String,
    group_id: String,
    phase_id: Number,
    hack_id: Number,
    user_id: String,
    tech_score: Number,
    ana_score: Number,
    vis_score: Number,

})

PersonalScoreSchema.statics.record = data => {
    return PersonalScore(data).save()
}


const PersonalScore = module.exports = Bloggify.db.model("PersonalScore", PersonalScoreSchema)
