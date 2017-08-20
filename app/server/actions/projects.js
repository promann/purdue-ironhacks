const Bloggify = require("bloggify")
    , aws = require("aws-sdk")
    , paths2tree = require("paths2tree")

const S3_BUCKET = process.env.S3_BUCKET
    , PATH_PPROJECTS = "projects"

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    signatureVersion: 'v4'
});

const buildFilePath = data => `${PATH_PPROJECTS}/${data.user || data.username}/${data.projectName || data.project_name}/${data.filepath}`;

// :username, :projecName, :filepath
Bloggify.on("projects.streamFile", ctx => {
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
    });

    stream.pipe(ctx.res);
});

Bloggify.actions.post("project.saveFile", (ctx, cb) => {
    // TODO Check access, auth etc.
    // TODO Validate data

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data),
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
        Key: buildFilePath(ctx.data)
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

Bloggify.actions.post("project.listFiles", (ctx, cb) => {
    // TODO Check access, auth etc.
    // TODO Validate data
    const data = ctx.data
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${PATH_PPROJECTS}/${data.username}/${data.project_name}/`
    };
    s3.listObjects(params, function(err, data) {
        const files = data.Contents.map(c => c.Key.split("/").slice(2).join("/"));
        let id = 0
        const tree = paths2tree(files, "/", node => {
            node.id = ++id
            node.filename = node.name
        })
        cb(null, tree.children[0])
    });
})
