exports.before = (ctx, cb) => {
    const user = Bloggify.services.session.getUser(ctx)
        , HackTypes = Bloggify.services.hack_types
        , Session = Bloggify.services.session

    if (ctx.pathname !== "/task" && user && HackTypes[user.profile.hack_type].start_date > new Date() && !Session.isAdmin(user)) {
        return ctx.redirect("/timeline")
    }

    if (user) {
        return Bloggify.services.user.get(user, (err, user) => {
            if (err) {
                return cb(err)
            }
            ctx.req.session._sessionData.user = user
            ctx.user = user
            cb()
        })
    }

    cb()
}
