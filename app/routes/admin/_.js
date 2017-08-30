const forEach = require("iterate-object");

module.exports = (ctx, cb) => {
    const user = Bloggify.services.Session.getUser(ctx);

    if (!user) {
        return ctx.redirect("/");
    }

    const dbUser = user;
    if (dbUser.role !== "admin" && dbUser.username !== process.env.ADMIN_USERNAME) {
        return ctx.redirect("/");
    }

    if (ctx.method === "post") {
        const deleteUserId = ctx.data["delete-user-id"];
        if (deleteUserId) {
            Bloggify.models.User.removeUser(deleteUserId, err => {
                ctx.redirect("/admin");
            });
            return;
        }
        if (!ctx.data.hack_types) {
            return ctx.redirect("/admin");
        }

        let foundInvalidDate = false;
        forEach(ctx.data.hack_types, hType => {
            hType.start_date = new Date(hType.start_date);
            hType.hack_start_date = new Date(hType.hack_start_date);
            hType.next_phase_date = new Date(hType.next_phase_date);
            if (isNaN(hType.start_date) || isNaN(hType.hack_start_date) || isNaN(hType.next_phase_date)) {
                foundInvalidDate = true;
            }
        });

        if (foundInvalidDate) {
            return ctx.apiError("Invalid date. Make sure the format is correct.");
        }

        Bloggify.models.Settings.setSettings({
            hack_types: ctx.data.hack_types
        });

        Promise.all(ctx.data.users.map(c => {
            const roleValue = c.update.role;
            delete ctx.data.role;
            return Bloggify.models.User.updateUser({
                _id: c._id
            }, {
                role: roleValue,
                profile: {
                    [ctx.data.hack_types[c.hack_type].phase]: {
                        "project_url": c.update.project_url
                      , "github_repo_url": c.update.github_repo_url
                      , "score_technical": +c.update.score_technical || 0
                      , "score_info_viz": +c.update.score_info_viz || 0
                      , "score_novelty": +c.update.score_novelty || 0
                      , "score_custom": c.update.score_custom && +c.update.score_custom
                      , "score_total": +c.update.score_total || 0
                    }
                }
            });
        })).then(c => {
            ctx.apiMsg({ success: true });
        }).catch(e => {
            ctx.apiError(e);
        });
    } else {
        Settingsmodels.Settings.getSettings((err, options) => {
            if (err) { return cb(err); }
            Bloggify.models.User.find({}, {
                password: 0
            }, (err, users) => {
                if (err) { return cb(err); }
                users = users.map(c => c.toObject());
                cb(null, {
                    users: users
                  , settings: options.settings
                });
            });
        });
    }
};
