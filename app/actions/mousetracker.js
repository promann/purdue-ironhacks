// Personal Score

exports.insertPersonalScore = ctx => {
    return Bloggify.services.mousetracker.saveMouseSet(ctx.data)
}
