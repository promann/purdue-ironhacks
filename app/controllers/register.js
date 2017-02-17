const User = require("./User");
const Session = require("./Session");
const qs = require("querystring");
const UNIVERSITIES = require("./Universities");

const UNI_OPTIONS = Object.keys(UNIVERSITIES).map(c => {
    let uni = UNIVERSITIES[c];
    return {
        value: c
      , label: uni.label
      , survey: uni.survey
    };
});

exports.get = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }

    if (!Session.isAuthenticated(lien) && !lien.getSessionData("new_user")) {
        return lien.redirect("/login");
    }

    const user = lien.getSessionData("new_user");
    const userId = user.password;
    const qsuid = lien.query.uid;

    if (userId === qsuid) {
        const uni = UNIVERSITIES[user.profile.university];
        return User.create(user, (err, newUser) => {
            if (err) { return lien.redirect("/"); }
            Bloggify.emit("user:registered", newUser);
            Session.loginUser(newUser, lien);
        });
    }

    cb(null, {
        uniOptions: UNI_OPTIONS
    });
};

exports.post = (lien, cb) => {
    const user = lien.getSessionData("new_user");

    if (!user) {
        return lien.redirect("/login");
    }

    let university = lien.data.university;
    if (!university) {
        return cb(null, {
            err: "Please select an option."
          , uniOptions: UNI_OPTIONS
        });
    }

    let selectedUni = UNIVERSITIES[university];
    if (!selectedUni) {
        return cb(null, {
            err: "Please select a valid option."
          , uniOptions: UNI_OPTIONS
        });
    }

    lien.setSessionData({
        new_user: {
            profile: {
                university: university
            }
        }
    });

    let surveyLink = selectedUni.survey;
    const redirectTo =  `${Bloggify.options.metadata.domain}/register?uid=${user.password}`;
    if (process.argv.includes("--bypass-survey")) {
        return lien.redirect(redirectTo);
    }
    const qsParams = qs.stringify({
        redirect_to: redirectTo
      , user_email: user.email
      , user_id: user._id
    });

    lien.redirect(
        `${surveyLink}?${qsParams}`
    );
};
