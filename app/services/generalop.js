exports.saveGeneralOP = (data) => {
	return Bloggify.models.Settings.getSettings().then(settings => {
        return Bloggify.models.GeneralScoreOP.record(data)
    }).then(() =>
        ({ success: true })
    )
}