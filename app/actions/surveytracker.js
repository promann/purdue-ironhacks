exports.insert = ctx => {
    console.log(ctx)
    return Bloggify.services.surveyservice.saveClick(ctx.data)
}