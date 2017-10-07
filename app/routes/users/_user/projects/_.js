// Disable the editor if the forum didn't start yet
exports.use = (ctx, cb) => {
	if (new Date() < Bloggify.models.Settings.HACK_TYPES[ctx.user.profile.hack_type].start_date) {
		ctx.redirect("/timeline")
		return
	}
	cb()
}


module.exports = ctx => {
    const Project = Bloggify.models.Project
    return Project.find({
        username: ctx.selected_user.username
    }).then(projects => {
        return { projects }
    })
};
