const Bloggify = require("bloggify");

Bloggify.actions.post("project.saveFile", (ctx, cb) => {
	// TODO Check access, auth etc.
	// TODO Validate data
	console.log(ctx.data);
	cb(null, {
		success: true
	})
})