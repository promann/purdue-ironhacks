const aws = require("aws-sdk")
	, promisfy = require("util-promisifyall")

const S3_BUCKET = process.env.S3_BUCKET
    , PATH_PPROJECTS = "projects"

const s3 = Bloggify.options.s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    signatureVersion: "v4"
});

promisfy(s3)

const buildFilePath = data => `${PATH_PPROJECTS}/${data.user || data.username}/${data.projectName || data.project_name}/${data.filepath}`

module.exports = {
	s3, S3_BUCKET, PATH_PPROJECTS, buildFilePath
}