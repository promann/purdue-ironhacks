module.exports = ctx => {
    ctx.end("")
    return false
    // /preview/:user/:project/index.html
    //0 1       2     3        4
    ctx.params.filepath = ctx.url.pathname.split("/").slice(4).join("/")
    Bloggify.services.projects.streamFile(ctx);
    return false
};
