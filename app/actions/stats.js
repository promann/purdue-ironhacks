exports.before = ctx => {
    return Bloggify.services.session.onlyAuthenticated(ctx)
}

exports.insert = ctx => {
    const user = ctx.user
    const ev = {
        actor: user._id,
        event: ctx.data.event,
        metadata: ctx.data.metadata || {}
    }

    ev.metadata.user_agent = ctx.header("user-agent")

    return Bloggify.models.Settings.get().then(settings => {
        ev.metadata.phase = settings.settings.hack_types[user.profile.hack_type].phase
        return Bloggify.models.Stats.record(ev)
    }).then(() =>
        ({ success: true })
    )
}
