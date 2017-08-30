exports.post = ctx => {
    ctx.destroySession();
    ctx.redirect("/");
};
