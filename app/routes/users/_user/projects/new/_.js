const slug = require("slugo")

exports.post = ctx => {
    const user = ctx.user
        , data = ctx.data

    data.name = slug(data.name)
    data.username = user.username
    

    return Bloggify.services.projects.create(data).then(project => {
        ctx.redirect(project.url);
        return false
    })
};
