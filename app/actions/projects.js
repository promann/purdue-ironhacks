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

exports.before = ctx => {
    const user = Bloggify.services.session.onlyAuthenticated(ctx)
    if (ctx.data) {
        ctx.data.username = user.username
    }
}

exports.saveFile = ["post", ctx => {
    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data),
        Body: ctx.data.content
    }

    return s3.putObjectAsync(params)
}]

exports.deleteFile = ["post", ctx => {
    if (ctx.data.filepath === "index.html") {
        throw Bloggify.errors.FILE_SHOULD_NOT_BE_DELETED(ctx.data.filepath)
    }

    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data)
    }

    return s3.deleteObjectAsync(params)
}]

exports.getFile = ["post", ctx => {
    const params = {
        Bucket: S3_BUCKET,
        Key: buildFilePath(ctx.data)
    }

    return s3.getObjectAsync(params).then(data => {
        data.Body = data.Body.toString("utf-8")
        return data
    })
}]

exports.listFiles = ["post", ctx => {
    const data = ctx.data
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${PATH_PPROJECTS}/${data.username}/${data.project_name}/`
    }
    return s3.listObjectsAsync(params).then(data => {
        const files = data.Contents.map(c => c.Key.split("/").slice(2).join("/"))
        let id = 0
        const tree = paths2tree(files, "/", node => {
            node.id = ++id
            node.filename = node.name
            if (node.filename === "index.html") {
                node.deletable = false
            }
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
    })
}]

exports.commit = ["post", ctx => {
    return Bloggify.models.Project.findOne({
        username: ctx.user.username,
        name: ctx.data.project_name
    }).then(project => {
        if (!project) {
            throw Bloggify.errors.PROJECT_NOT_FOUND()
        }
        return project.syncGitHubRepository(ctx.data.commit_message)
    })
}]
