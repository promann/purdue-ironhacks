exports.getUser = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
  return Bloggify.services.exports.getUser(user._id)
}
