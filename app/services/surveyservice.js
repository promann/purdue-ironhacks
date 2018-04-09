exports.saveClick = (data) => {
	return Bloggify.models.Settings.getSettings().then(settings => {
        return Bloggify.models.SurveyTracker.record(data)
    }).then(() =>
        ({ success: true })
    )
}