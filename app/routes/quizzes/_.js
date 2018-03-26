const findValue = require("find-value")

// Define the quizzes list
const quizzes = [
    ["HTML & CSS", "https://purdue.ca1.qualtrics.com/jfe/form/SV_0l9UUOmgB2TCZ1P", "html_css"]
  , ["Bootstrap", "https://purdue.ca1.qualtrics.com/jfe/form/SV_ai47Laj9EM1n433", "bootstrap"]
  , ["Javascript and jQuery", "https://purdue.ca1.qualtrics.com/jfe/form/SV_1Xkpq23Qu5j7P01", "javascript_jquery"]
  , ["Google Map API", "https://purdue.ca1.qualtrics.com/jfe/form/SV_eEe3JnzCkS2ppnn", "google_maps_api"]
  , ["D3.js", "https://purdue.ca1.qualtrics.com/jfe/form/SV_0ep4CDeW4BYTckR", "d3_js"]
];


// Map the quizzes labels to the data
const validQuizzes = {};
quizzes.forEach(c => {
    validQuizzes[c[2]] = c;
});

module.exports = ctx => {
    const user = ctx.user;

    // Set the quiz complete
    const completed = ctx.query.markComplete;
    if (completed && validQuizzes[completed]) {
        return Bloggify.models.User.updateUser({
            _id: user._id
        }, {
            profile: {
                surveys: {
                    [completed]: {
                        ended_at: new Date()
                    }
                }
            }
        }).then(() => {
            ctx.redirect("/quizzes");
            return false
        })
    }

    // Generate the redirect links
    const completedSurveys = findValue(user, "profile.surveys") || {};
    const userQuizzes = quizzes.map(c => {
        const redirectTo =  encodeURIComponent(`${Bloggify.options.domain}/quizzes?markComplete=${c[2]}`);
        return {
            label: c[0]
          , url: `${c[1]}?redirect_to=${redirectTo}&user_email=${user.email}&user_id=${user._id}`
          , is_complete: !!completedSurveys[c[2]]
        };
    });

    // Send the quizzes array to the view
    return {
        quizzes: userQuizzes
    }
};
