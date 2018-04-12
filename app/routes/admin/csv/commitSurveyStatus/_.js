module.exports = ctx => {
    Bloggify.services.exports.commitSurveyStatus(ctx.query.exportType).pipe(ctx.res);
    return false
}
