module.exports = ctx => {
    const hackType = ctx.query.hackType
        , hackId = ctx.query.hackId
        ;

    lien.header(
        "Content-Disposition"
      , `attachment; filename=users-${ctx.formattedDate}${hackType ? "-" + hackType : ""}${hackId ? "-" + hackId : hackId}.csv`
    );

    Bloggify.services.csv.users({
        hackType: hackType
      , hackId: +hackId
    }).pipe(ctx.res);

    return false
}
