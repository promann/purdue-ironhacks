//exports.before = ctx => {
//    ctx.redirect("/")
//}

exports.post = ctx => {
    const user = ctx.user
        , data = ctx.data

    data.username = user.username
    data.id = user._id

    return Bloggify.services.projects.create(data).then(project => {
        ctx.redirect(project.url);
        return false
    })

};
