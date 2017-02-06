const Bloggify = require("bloggify")
    , csv = require("./api")
    , moment = require("moment")
    , Session = require("../../controllers/Session")
    ;

const DATE_FORMAT = "YYYY-MM-DD-hh-mm";

exports.init = () => {
    // Download topics
    Bloggify.server.addPage("/admin/csv/topics", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }
        lien.header({
            "Content-Disposition": `attachment; filename=${moment().format(DATE_FORMAT)}-topics.csv`,
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
            "Content-Disposition": `attachment; filename=${moment().format(DATE_FORMAT)}-scores.csv`,
            "Content-Type": "text/csv"
        });
        csv.scores().pipe(lien.res);
    });
};
