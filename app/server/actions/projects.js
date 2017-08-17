const Bloggify = require("bloggify")
	, aws = require("aws-sdk")
	;

const S3_BUCKET = process.env.S3_BUCKET
    , PATH_PPROJECTS = "projects"
    ;

const s3 = new aws.S3({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    signatureVersion: 'v4'
});

const buildFilePath = ctx => {
	return `${PATH_PPROJECTS}/${ctx.data.username}/${ctx.data.project_name}/${ctx.data.filepath}`;
};

Bloggify.actions.post("project.saveFile", (ctx, cb) => {
	// TODO Check access, auth etc.
	// TODO Validate data

	const params = {
		Bucket: S3_BUCKET,
		Key: buildFilePath(ctx),
		Body: ctx.data.content
	};

    s3.putObject(params, (err, data) => {
        if (err) {
        	cb(new Error("Error while saving the file."));
        	return Bloggify.log(err);
        }
		cb();
    });
})



Bloggify.actions.post("project.getFile", (ctx, cb) => {
	// TODO Check access, auth etc.
	// TODO Validate data

	const params = {
		Bucket: S3_BUCKET,
		Key: buildFilePath(ctx)
	};

    s3.getObject(params, (err, data) => {
        if (err) {
        	cb(new Error("Error while saving the file."));
        	return Bloggify.log(err);
        }
        data.Body = data.Body.toString("utf-8");
		cb(null, data);
    });
})