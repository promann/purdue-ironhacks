const UNIVERSITIES = require("./Universities");
const Session = require("./Session");

exports.get = (lien, cb) => {

    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }

    const hackType = lien.query.hackType
        , hackTypeObj = UNIVERSITIES[hackType]
        ;

    if (!hackType || !hackTypeObj) {
        return lien.redirect("/");
    }


    lien.setSessionData({
        new_user: {
            profile: {
                university: hackType
            }
        }
      , surveyLink: hackTypeObj.survey
    });

    lien.redirect("/login");
};
