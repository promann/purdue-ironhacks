module.exports = ctx => {
    // /preview/:user/:project/index.html
    //0 1       2     3        4
    debugger
    ctx.params.filepath = ctx.url.pathname.split("/").slice(4).join("/")
    Bloggify.services.projects.streamFile(ctx);
    return false
};
