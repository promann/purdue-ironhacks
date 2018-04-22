const findValue = require("find-value")
const CUPL_HACK_TYPE  = "CUPL_spring_2018"
// Define the quizzes list For UNAL
const quizzesUNAL = [
    ["HTML & CSS", "https://purdue.ca1.qualtrics.com/jfe/form/SV_0l9UUOmgB2TCZ1P", "html_css"]
  , ["Bootstrap", "https://purdue.ca1.qualtrics.com/jfe/form/SV_ai47Laj9EM1n433", "bootstrap"]
  , ["Javascript and jQuery", "https://purdue.ca1.qualtrics.com/jfe/form/SV_1Xkpq23Qu5j7P01", "javascript_jquery"]
  , ["Google Map API", "https://purdue.ca1.qualtrics.com/jfe/form/SV_eEe3JnzCkS2ppnn", "google_maps_api"]
  , ["D3.js", "https://purdue.ca1.qualtrics.com/jfe/form/SV_0ep4CDeW4BYTckR", "d3_js"]
];
// Define the quizzes list fo CUPL
const quizzesCUPL = [
    ["HTML & CSS", "https://purdue.ca1.qualtrics.com/jfe/form/SV_0wvLmftYNcq7XmZ", "html_css"]
  , ["JavaScript & jQuery", "https://purdue.ca1.qualtrics.com/jfe/form/SV_6VyKlIuvYPISjWt", "javascript_jquery"]
  , ["d3.js", "https://purdue.ca1.qualtrics.com/jfe/form/SV_3TUal9JowRXS3Ot", "d3"]
  , ["Design Elements", "https://purdue.ca1.qualtrics.com/jfe/form/SV_cXXHVFVtaBdEnXf", "design_elements"]
  , ["Design Principles", "https://purdue.ca1.qualtrics.com/jfe/form/SV_1RkuOP1lOUqvoDH", "design_principles"]
  , ["Usability Heuristics", "https://purdue.ca1.qualtrics.com/jfe/form/SV_3eqr0m63LBvRdv7", "usability_heuristics"]
];
const validQuizzes = {}
// Map the quizzes labels to the data

module.exports = ctx => {
  const user = ctx.user;

  if(user.profile.hack_type == CUPL_HACK_TYPE){
    const validQuizzes = {};
    quizzesCUPL.forEach(c => {
        validQuizzes[c[2]] = c;
    });
  }else{
    const validQuizzes = {};
    quizzesUNAL.forEach(c => {
        validQuizzes[c[2]] = c;
    });
  }
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
  //Showing the quizzes according to the hack
  if(user.profile.hack_type == CUPL_HACK_TYPE){
    const userQuizzes = quizzesCUPL.map(c => {
      const redirectTo =  encodeURIComponent(`${Bloggify.options.domain}/quizzes?markComplete=${c[2]}`);
      return {
        label: c[0]
      , url: `${c[1]}?redirect_to=${redirectTo}&user_email=${user.email}&user_id=${user.username}`
      , is_complete: !!completedSurveys[c[2]]
      };
    });
    // Send the quizzes array to the view
    return {
        quizzes: userQuizzes
    }
  }else{
    const userQuizzes = quizzesUNAL.map(c => {
      const redirectTo =  encodeURIComponent(`${Bloggify.options.domain}/quizzes?markComplete=${c[2]}`);
      return {
        label: c[0]
      , url: `${c[1]}?redirect_to=${redirectTo}&user_email=${user.email}&user_id=${user.username}`
      , is_complete: !!completedSurveys[c[2]]
      };
    });
    // Send the quizzes array to the view
    return {
        quizzes: userQuizzes
    }
  }

};
