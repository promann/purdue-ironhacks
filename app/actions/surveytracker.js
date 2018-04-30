exports.insert = ctx => {
    return Bloggify.services.survey_tracker.saveClick(ctx.data)
}