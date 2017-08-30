module.exports = ctx => {
    lien.header(
        "Content-Disposition"
      , `attachment; filename=${ctx.formattedDate}-topics.csv`
    );
    Bloggify.services.csv.topics().pipe(ctx.res);
    return false
}
