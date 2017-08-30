const Session = require("./session")

// Handle GitHub login
Bloggify.require("github-login", GitHub => {
    GitHub.on("login-error", (err, ctx) => {
        console.error(err)
        ctx.redirect("/")
    })
    GitHub.on("login-success", (token, user, ctx) => {
        User.get({
            username: user.login
        }, (err, existingUser) => {
            if (err) {
                Bloggify.log(err)
                return ctx.redirect("/")
            }

            if (existingUser) {
                return Session.loginUser(existingUser, ctx)
            }

            const newUser = new Bloggify.models.User({
                username: user.login,
                email: user.emails[0].email,
                password: idy(),
                profile: {
                    bio: user.bio,
                    website: user.blog,
                    full_name: user.name,
                    picture: user.avatar_url,
                    github_username: user.login
                }
            })

            ctx.startSession({
                new_user: newUser.toObject()
            })
            ctx.redirect("/register")
        })
    })
})
