const SurveyTrackerSchema = new Bloggify.db.Schema({
    hack_type: String,
    user_email: String,
    github_username: String,
    timestamp: Date,
    phase: String,
    status: Boolean,
    hack_id : String
})

SurveyTrackerSchema.statics.record = data => {
	console.log(SurveyTracker(data))
    return SurveyTracker(data).save()
}


const SurveyTracker = module.exports = Bloggify.db.model("SurveyTracker", SurveyTrackerSchema)