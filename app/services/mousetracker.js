// Mouse tracker service

exports.saveMouseSet = (data) => {
	return Bloggify.models.Settings.getSettings().then(settings => {
        return Bloggify.models.MouseSet.record(data)
    }).then(() =>
        ({ success: true })
    )
}