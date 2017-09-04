const paths2tree = require("paths2tree")
    , forEach = require("iterate-object")
    , sameTime = require("same-time")
    , bindy = require("bindy")
    , { buildFilePath, s3, S3_BUCKET, PATH_PPROJECTS } = require("../common/aws-s3")
    , util = require("util")
    , setTimeoutAsync = duration => {
        return new Promise(res => {
            setTimeout(res, duration)
        })
      }

// TODO Move it from actions
Bloggify.on("project:create-template", data => {

    data.project_name = data.name;

    const files = {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <button id="btn">Click me</button>
    </div>
    <script src="index.js"></script>
</body>
</html>`,
        "style.css": `body {
    color: #444;
    font-family: Arial, sans-serif;
}

.container {
    width: 100%;
    max-width: 960px;
}`,
        "index.js": `
(function () {
    document.getElementById("btn").addEventListener("click", function () {
        alert("Hi! :)");
    });
})();`
    }

    forEach(files, (content, name) => {
        data.filepath = name
        const params = {
            Bucket: S3_BUCKET,
            Key: buildFilePath(data),
            Body: content
        };
        s3.putObject(params, (err, data) => {});
    })
})


exports.saveFile = ["post", ctx => {
    // TODO Check access, auth etc.
    // TODO Validate data

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data),
        Body: ctx.data.content
    };

    return s3.putObjectAsync(params);
}]



exports.deleteFile = ["post", ctx => {
    // TODO Check access, auth etc.
    // TODO Validate data

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data)
    };

    return s3.deleteObjectAsync(params);
}]

exports.getFile = ["post", ctx => {
    // TODO Check access, auth etc.
    // TODO Validate data

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data)
    };

    return s3.getObjectAsync(params).then(data => {
        data.Body = data.Body.toString("utf-8");
        return data;
    });
}]

exports.listFiles = ["post", ctx => {
    // TODO Check access, auth etc.
    // TODO Validate data
    const data = ctx.data
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${PATH_PPROJECTS}/${data.username}/${data.project_name}/`
    };
    return s3.listObjectsAsync(params).then(data => {
        const files = data.Contents.map(c => c.Key.split("/").slice(2).join("/"));
        let id = 0
        const tree = paths2tree(files, "/", node => {
            node.id = ++id
            node.filename = node.name
            node.toggled = true
            setTimeout(() => {
                if (node.children && !node.children.length) {
                    delete node.children
                }
            })
        })
        return tree
    }).then(tree => {
        return setTimeoutAsync().then(() => tree.children[0])
    });
}]


// TODO
exports.fork = ["post", (ctx, cb) => {
    // TODO Check access, auth etc.
    // TODO Validate data
    if (ctx.user) {
        return cb(new Error("You have to be authenticated."));
    }

    const data = ctx.data
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${PATH_PPROJECTS}/${data.username}/${data.project_name}/`
    };

    s3.listObjects(params, function(err, data) {
        sameTime(bindy(data.Contents, (cFile, done) => {
            var params = {
                Bucket: S3_BUCKET,
                CopySource: cFile.Key,
                Key: `${PATH_PPROJECTS}/${ctx.user.username}/${data.project_name}/`
            };
            s3.copyObject(params, done);
        }), err => {
            if (err) {
                Bloggify.log(err);
                return cb(new Error("Failed to copy the files."))
            }
            cb()
        })
    });
}]
