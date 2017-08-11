const Bloggify = require("bloggify")
    , Project = Bloggify.models.Project
    ;

module.exports = (ctx, cb) => {
	Project.find({
		username: ctx.selected_user.username 
	}, (err, projects) => {
		if (err) { return cb(err); }
		cb(null, { projects }); 
	})
};