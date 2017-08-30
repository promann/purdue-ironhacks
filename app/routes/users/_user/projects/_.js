module.exports = (ctx, cb) => {
    const Project = Bloggify.models.Project
    Project.find({
        username: ctx.selected_user.username
    }, (err, projects) => {
        if (err) { return cb(err); }
        cb(null, { projects });
    })
};
