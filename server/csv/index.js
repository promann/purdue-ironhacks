const Bloggify = require("bloggify")
    , csv = require("./api")
    , moment = require("moment")
    , Session = require("../../controllers/Session")
    ;

exports.init = () => {
    // Download topics
    Bloggify.server.addPage("/admin/csv/topics", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }
        lien.header({
            "Content-Disposition": `attachment; filename=${moment().format("LLLL")}-topics.csv`,
            "Content-Type": "text/csv"
        });
        csv.topics().pipe(lien.res);
    });

    // Download scores
    Bloggify.server.addPage("/admin/csv/scores", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }
        lien.header({
            "Content-Disposition": `attachment; filename=${moment().format("LLLL")}-scores.csv`,
            "Content-Type": "text/csv"
        });
        csv.scores().pipe(lien.res);
    });
};
