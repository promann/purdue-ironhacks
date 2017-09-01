module.exports = ctx => {
    ctx.header(
        "Content-Disposition"
      , `attachment; filename=${ctx.formattedDate}-scores.csv`
    );
    Bloggify.services.csv.scores().pipe(ctx.res);
    return false
}
