const Session = require("./session")
    , idy = require("idy")

// Handle GitHub login
Bloggify.require("github-login", GitHub => {
    GitHub.on("login-error", (err, ctx) => {
        console.error(err)
        ctx.redirect("/")
    })
    GitHub.on("login-success", (token, user, ctx) => {
        Bloggify.models.User.getUser({
            username: user.login,
            email: user.emails[0].email
        }).then(existingUser => {
            const currentHackType = existingUser && existingUser.get("profile.hack_type")
            const shouldRegister = !existingUser || !currentHackType || Bloggify.models.Settings.HACK_TYPES[currentHackType].end_date < new Date()

            if (!shouldRegister) {
                return Bloggify.services.session.loginUser(existingUser, ctx)
            }

            let userToRegister = existingUser || new Bloggify.models.User({
                username: user.login,
                email: user.emails[0].email,
                password: idy(),
                profile: {
                    bio: user.bio,
                    website: user.blog,
                    full_name: user.name,
                    picture: user.avatar_url,
                    github_username: user.login,
                    github_id: user.id
                }
            })

            const selectedHackType = ctx.getSessionData("new_user.profile.hack_type")
            if (existingUser) {
                if (selectedHackType && currentHackType !== selectedHackType) {
                    existingUser.set("profile.hack_type", selectedHackType)
                    existingUser.set("profile.hack_id", undefined)
                    existingUser.set("profile.phase1", undefined)
                    existingUser.set("profile.phase2", undefined)
                    existingUser.set("profile.phase3", undefined)
                    existingUser.set("profile.phase4", undefined)
                    existingUser.set("profile.phase5", undefined)
                    existingUser.save()
                } else {
                    existingUser.set("profile.hack_type", undefined)
                    existingUser.set("profile.hack_id", undefined)
                    existingUser.set("profile.phase1", undefined)
                    existingUser.set("profile.phase2", undefined)
                    existingUser.set("profile.phase3", undefined)
                    existingUser.set("profile.phase4", undefined)
                    existingUser.set("profile.phase5", undefined)
                    existingUser.save()
                }
            }

            ctx.startSession({
                new_user: userToRegister.toObject()
            })

            ctx.redirect("/register")
        }).catch(err => {
            Bloggify.log(err)
            return ctx.redirect("/")
        })
    })
})

process.on("unhandledRejection", err => console.error(err.stack))
