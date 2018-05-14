// Personal Score

exports.insertPersonalScore = ctx => {
    return Bloggify.services.personalscore.savePersonalScore(ctx.data)
}

exports.getPersonalScores = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
    return Bloggify.services.exports.getPersonalScore(user)
}

// GeneralOS

exports.insertGeneralOS = ctx => {
    return Bloggify.services.generalos.saveGeneralOS(ctx.data)
}


exports.getGeneralOS = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
    return Bloggify.services.exports.getGeneralOS(user)
}

// GeneralOP 
exports.insertGeneralOP = ctx => {
    return Bloggify.services.generalop.saveGeneralOP(ctx.data)
}

exports.getGeneralOP = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
    return Bloggify.services.exports.getGeneralOP(user)
}

// Used Libraries

exports.getUsedLibraries = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
  return Bloggify.services.exports.getUsedLibraries(user.profile.hack_type)
}
