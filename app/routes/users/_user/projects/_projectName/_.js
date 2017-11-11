exports.use = (ctx, cb) => {
    const Project = Bloggify.models.Project
    if (!ctx.params.projectName) {
        return cb();
    }
    const isOwner = ctx.isProjectOwner = ctx.selected_user.username === ctx.user.username
    Project.findOne({
        username: ctx.selected_user.username,
        name: ctx.params.projectName
    }, (err, project) => {
        if (err) { return cb(err); }
        if (!project) {
            return ctx.next();
        }
        ctx.selected_project = project;

        // Check access
        const hackType = Bloggify.models.Settings.HACK_TYPES[ctx.user.profile.hack_type]
            , isOwner = ctx.isProjectOwner

        if (
            // Disable the editor if the forum didn't start yet
            new Date() < hackType.start_date

            || (
                // Don't show the project of a future phase in the current phase
                project.phase >= hackType.phase

                // The results page is not yet visible and another user is trying to access the project
                && (new Date() < hackType.show_results_date && !isOwner)
            )
        ) {
            ctx.redirect("/timeline")
            return false
        }
        cb();
    })
};
