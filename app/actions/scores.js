// Personal Score

exports.insertPersonalScore = ctx => {
    console.log(ctx)
    return Bloggify.services.personalscore.savePersonalScore(ctx.data)
}

exports.getPersonalScores = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
	console.log(user.profile.github_username)
    return Bloggify.services.exports.getPersonalScore(user.profile.github_username)
}

// GeneralOS

exports.insertGeneralOS = ctx => {
    console.log(ctx)
    return Bloggify.services.generalos.saveGeneralOS(ctx.data)
}


exports.getGeneralOS = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
	console.log(user.profile.github_username)
    return Bloggify.services.exports.getGeneralOS(user.profile.github_username)
}

// GeneralOP 


exports.insertGeneralOP = ctx => {
    console.log(ctx)
    return Bloggify.services.generalop.savePersonalScore(ctx.data)
}

exports.getGeneralOP = ctx => {
	const user = Bloggify.services.session.getUser(ctx)
	console.log(user.profile.github_username)
    return Bloggify.services.exports.getGeneralOP(user.profile.github_username)
}