const slug = require("slugo")

exports.post = ctx => {
    const user = ctx.user;

    const Project = Bloggify.models.Project
    const data = ctx.data;

    data.name = slug(data.name);
    data.username = user.username;
    return new Project(data).save().then(project => {
        Bloggify.emit("project:create-template", data)
        ctx.redirect(project.url);
        return false
    });
};
