exports.saveGeneralOS = (data) => {
	return Bloggify.models.Settings.getSettings().then(settings => {
        return Bloggify.models.GeneralScoreOS.record(data)
    }).then(() =>
        ({ success: true })
    )
}