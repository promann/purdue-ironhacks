const slug = require("slugo")

exports.post = ctx => {
    const user = ctx.user;
    
    data.name = slug(data.name);
    data.username = user.username;
    
    const data = ctx.data;

    return Bloggify.services.projects.create(data).then(project => {
        ctx.redirect(project.url);
        return false
    })


};
