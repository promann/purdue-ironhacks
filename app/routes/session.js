module.exports = ctx => {
    ctx.session.foo = ctx.session.foo || 0
    ++ctx.session.foo
    ctx.end(ctx.session)
    return false
}
