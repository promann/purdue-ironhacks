const slug = require("slugo")

exports.post = (ctx, cb) => {
    const user = Bloggify.services.session.isAuthenticated(ctx);
    const Project = Bloggify.models.Project
    if (!user) {
        return ctx.redirect("/");
    }
    const data = ctx.data;
    data.name = slug(data.name);
    data.username = user.username;
    new Project(data).save((err, project) => {
        if (err) {
            return cb(err);
        }
        Bloggify.emit("project:create-template", data)
        ctx.redirect(`/users/${project.username}/projects/${project.name}`);
    });
};
