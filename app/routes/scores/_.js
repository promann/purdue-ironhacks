const Daty = require("daty")

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = ctx => {
    const data = {}
    return Bloggify.models.Stats.find({
        actor: ctx.user._id,
        event: "save-file"
        console.log("tt")
        console.log(data)
        console.log("tt")
    }).then(res => {
        data.calendarValues = {}
        res.forEach(c => {
            const cDay = new Daty(c.created_at).format("YYYY-MM-DD")
            data.calendarValues[cDay] = data.calendarValues[cDay] || 0
            ++data.calendarValues[cDay]
        })
        console.log("yy")
        console.log(data)
        console.log("yy")
        return Bloggify.models.User.find({
            "profile.hack_type": ctx.user.profile.hack_type,
            "profile.hack_id": ctx.user.profile.hack_id
        })
    }).then(users => {
        data.users = users
        console.log("11")
        console.log(data)
        console.log("11")
        return Bloggify.models.Settings.getSettings()
    }).then(options => {
        const hackType = options.settings.hack_types[ctx.user.profile.hack_type]
            , phase = hackType.phase
            , notPublishedYet = new Date() < hackType.show_results_date

        if (phase === "phase1" && notPublishedYet) {
            return {
                phase,
                users: []
            }
        }

        let phaseToDisplay = phase
        if (notPublishedYet) {
            const currentPhase = (phase.match(/(\d+)/g) || [])[0]
                , previousPhase = currentPhase - 1

            phaseToDisplay = "phase" + previousPhase
        }

        data.users = data.users.map((u, i) => {
            u = u.toObject();
            if (u.username === ctx.user.username) {
                u.username = "This is you"
                u.you = true
            } else {
                u.username = `Hacker ${i + 1}`
            }

            const phaseObj = Object(u.profile[phaseToDisplay]);
            return {
                _id: u._id,
                username: u.username,
                score_technical: phaseObj.score_technical,
                score_info_viz: phaseObj.score_info_viz,
                score_novelty: phaseObj.score_novelty,
                score_total: phaseObj.score_total,
                project_url: phaseObj.project_url,
                phase: phaseToDisplay
            };
        });

        shuffle(data.users);
        console.log("---")
        console.log(data)
        console.log("---")

        return {
            users: data.users,
            phase: phaseToDisplay,
            calendarValues: data.calendarValues
        };
    });
};
