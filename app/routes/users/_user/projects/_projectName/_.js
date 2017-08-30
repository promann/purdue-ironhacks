exports.use = (ctx, cb) => {
    const Project = Bloggify.models.Project
    if (!ctx.params.projectName) {
        return cb();
    }
    Project.findOne({
        username: ctx.selected_user.username,
        name: ctx.params.projectName
    }, (err, project) => {
        if (err) { return cb(err); }
        if (!project) {
            return ctx.next();
        }
        ctx.selected_project = project;
        cb();
    })
};
