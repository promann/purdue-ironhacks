const User = require("../../User");
const Session = require("../../Session");

// Select the user for all the routes under /:user
exports.use = (ctx, cb) => {
    User.get({
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
    const authUser = Session.getUser(lien);
    if (!authUser) {
        return lien.next();
    }
    
    cb(null, {
        profile: lien.selected_user
    });
};
