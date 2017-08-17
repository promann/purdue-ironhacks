const Bloggify = require("bloggify");

module.exports = ctx => {
	Bloggify.emit("projects.streamFile", ctx);
};