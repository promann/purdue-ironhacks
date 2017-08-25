const Bloggify = require("bloggify")
    , Project = Bloggify.models.Project
    , Session = require("../../../Session")
    , slug = require("slug")
    ;

exports.post = (ctx, cb) => {
    const user = Session.isAuthenticated(ctx);
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
