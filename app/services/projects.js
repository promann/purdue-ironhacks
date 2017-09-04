var { buildFilePath, s3, S3_BUCKET, PATH_PPROJECTS } = require("../common/aws-s3")

exports.streamFile = ctx => {
    // TODO Check access, auth etc.
    // TODO Validate data

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.params)
    };

    ctx.res.contentType(ctx.params.filepath);
    const stream = s3.getObject(params).createReadStream();

    stream.on("error", err => {
    	
        ctx.res.contentType("plain/text");
        if (err.code === "NoSuchKey") {
            ctx.status(404).end("404 — Not found");
        } else {
            ctx.status(400).end(err.message);
        }
    })

    stream.pipe(ctx.res);
};