module.exports = ctx => {
    const Project = Bloggify.models.Project
    return Project.find({
        username: ctx.selected_user.username
    }).then(projects => {
        return { projects }
    })
};
