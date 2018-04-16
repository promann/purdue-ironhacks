exports.savePersonalScore = (data) => {
	return Bloggify.models.Settings.getSettings().then(settings => {
        return Bloggify.models.PersonalScore.record(data)
    }).then(() =>
        ({ success: true })
    )
}