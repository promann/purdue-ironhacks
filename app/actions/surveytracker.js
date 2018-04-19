exports.insert = ctx => {
    console.log(ctx)
    return Bloggify.services.survey_tracker.saveClick(ctx.data)
}