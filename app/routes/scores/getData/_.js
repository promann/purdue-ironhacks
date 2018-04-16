module.exports = ctx => {
	console.log(ctx)
	console.log(Bloggify.services.exports.getPersonalScore)
    Bloggify.services.exports.getPersonalScore();
    return false
}
