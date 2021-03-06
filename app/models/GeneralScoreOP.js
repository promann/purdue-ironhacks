const GeneralScoreOPSchema = new Bloggify.db.Schema({
    semester: String,
    group_id: String,
    phase_id: Number,
    hack_id: Number,
    user_id: String,
    project: String,
    hacker_id: Number,
    hacker_position: Number
})


GeneralScoreOPSchema.statics.record = data => {
    return GeneralScoreOP(data).save()
}


const GeneralScoreOP = module.exports = Bloggify.db.model("GeneralScoreOP", GeneralScoreOPSchema)