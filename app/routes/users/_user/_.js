// Select the user for all the routes under /:user
exports.use = (ctx, cb) => {
    Bloggify.models.User.getUser({
        filters: {
            username: ctx.params.user
        }
      , fields: {
            password: 0
        }
    }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return ctx.next();
        }
        user = user.toObject();
        user.url = User.getProfileUrl(user);
        ctx.selected_user = user;
        cb();
    })
};

exports.get = (lien, cb) => {
    const authUser = Bloggify.services.session.getUser(lien);
    if (!authUser) {
        return lien.next();
    }

    cb(null, {
        profile: lien.selected_user
    });
};
