const Bloggify = require("bloggify")
    , Project = Bloggify.models.Project
    , Session = require("../../../Session")
    ;

exports.post = (ctx, cb) => {
	const user = Session.isAuthenticated(ctx);
    if (!user) {
        return ctx.redirect("/");
    }
	const data = ctx.data;
	data.username = user.username;
	new Project(data).save((err, project) => {
		if (err) {
			return cb(err);
		}
		ctx.redirect(`/users/${project.username}/projects/view/${project.name}`);
	});
};