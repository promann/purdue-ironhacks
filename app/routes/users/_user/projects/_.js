exports.get = ctx => {
    const hackType = Bloggify.models.Settings.HACK_TYPES[ctx.user.profile.hack_type]
        , isOwner = ctx.isProjectOwner = ctx.selected_user.username === ctx.user.username
        , Project = Bloggify.models.Project

    if (
        // Disable the editor if the forum didn't start yet
        new Date() < hackType.start_date

        // The results page is not yet visible and another user is trying to access the project
        || (new Date() < hackType.show_results_date && !isOwner)
    ) {
        ctx.redirect("/timeline")
        return false
    }

    return Project.find({
        username: ctx.selected_user.username
    }).sort({ name: 1 }).then(projects => {
        return { projects }
    })
};
