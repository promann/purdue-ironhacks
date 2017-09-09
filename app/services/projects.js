const { buildFilePath, s3, S3_BUCKET, PATH_PPROJECTS } = require("../common/aws-s3")
    , forEach = require("iterate-object")
    , Project = Bloggify.models.Project
    , GitHubApi = require("gh.js")
    , promisfy = require("util-promisifyall")
    , execa = require("execa")
    , path = require("path")
    , streamp = require("streamp")

const GitHub = promisfy(new GitHubApi(process.env.GITHUB_ADMIN_TOKEN))

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

exports.createTemplateFiles = data => {

    data.project_name = data.name;

    const files = {
        "README.md": `## ${data.name}

${data.description}
`,
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

    const promises = []

    forEach(files, (content, name) => {
        data.filepath = name
        const params = {
            Bucket: S3_BUCKET,
            Key: buildFilePath(data),
            Body: content
        };
        promises.push(s3.putObjectAsync(params));
    })

    return Promise.all(promises)
}


exports.createGitHubRepository = (username, projectName) => {
    const repoName = Project.getGitHubRepoName(username, projectName, new Date().getFullYear())
    return GitHub.getAsync(`orgs/${process.env.GITHUB_PROJECTS_ORGANIZATION}/repos`, {
        data: {
            name: repoName,
            private: true
        }
    })
}

exports.downloadFiles = (project, projectPath) => {
    const repoPath = project.local_path

    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${PATH_PPROJECTS}/${project.username}/${project.name}/`
    };

    return s3.listObjectsAsync(params).then(data => {
        return Promise.all(data.Contents.map(currentObject => {
            const currentFilePath = currentObject.Key.split("/").slice(3).join("/")
            const localFilePath = path.resolve(repoPath, currentFilePath)
            return new Promise(res => {
                const params = {
                    Bucket: S3_BUCKET,
                    Key: currentObject.Key
                };
                const stream = s3.getObject(params).createReadStream();
                const wStream = new streamp.writable(localFilePath)
                stream.pipe(wStream).on("close", res)
            })
        }))
    })
}

exports.syncGitHubRepository = (project, commitMessage) => {
    const repoPath = project.local_path
    
    // 1. Delete the projec path
    return execa("rm", ["-rf", repoPath]).then(() => 
        // 2. Clone the GitHub repo
        execa("git", ["clone", project.github_repo_url, repoPath])
    ).then(() => 
        // 3. Remove all the files
        execa("rm", ["-rf", "*"], { cwd: repoPath })
    ).then(() => 
        // 4. Download the files from S3
        project.downloadFiles(repoPath)
    ).then(() => 
        // 5. Add the files to commit
        execa("git", ["add", "-A", "."], { cwd: repoPath })
    ).then(() => 
        // 6. Create the commit
        execa("git", ["commit", "-m", commitMessage, "--author", `${project.user.username} <${project.user.email}>`], { cwd: repoPath })
    ).then(() => 
        // 7. Push the commit to GitHub
        execa("git", ["push", "--all"], { cwd: repoPath })
    )
}

exports.create = projectData => {
    let project = null
    return new Project(projectData).save().then(_project => {
        project = _project
        return exports.createTemplateFiles(projectData)
    }).then(() => {
        // TODO Do that in background
        debugger
        return exports.createGitHubRepository(projectData.username, projectData.name)
    }).then(() => {
        debugger
        return project.syncGitHubRepository("Inital commit.")
    });
}