const Bloggify = require("bloggify")
    , Topic = require("../controllers/Topic")
    , Session = require("../controllers/Session")
    , Stats = require("../controllers/Stats")
    , HackTypes = require("../controllers/HackTypes")
    , SocketIO = require("socket.io")
    , idy = require("idy")
    , Settings = require("../controllers/Settings")
    , CSVEndpoints = require("./csv")
    ;

module.exports = bloggify => {
    const User = require("../controllers/User");
    const Notifications = require("./notifications");

    Bloggify.server.hook("before", [
        "/",
        "/posts",
        "/posts/:postId-:postSlug",
        "/new",
        "/scores",
        "/task",
    ], (lien, cb) => {
        const user = Session.getUser(lien);
        if (lien.pathname !== "/task" && user && HackTypes[user.profile.hack_type].start_date > new Date() && !Session.isAdmin(user)) {
            return lien.redirect("/timeline");
        }
        if (user) {
            return User.get(user, (err, user) => {
                if (err) {
                    Bloggify.log(err);
                    return lien.redirect("/500");
                }
                lien.req.session._sessionData.user = user;
                lien.user = user;
                cb();
            });
        }
        cb();
    });
    CSVEndpoints.init();

    Bloggify.server.addPage("/api/posts", lien => {
        const user = Session.getUser(lien);
        if (!user) {
            return lien.next();
        }

        if (!Session.isAdmin(user)) {
            lien.query["metadata.hack_type"] = user.profile.hack_type;
            lien.query["metadata.hack_id"] = user.profile.hack_id;
        }

        Topic.getMore({
            filters: lien.query
        }, (err, data) => {
            if (err) {
                return lien.apiError(err);
            }
            lien.end(data);
        });
    });

    Bloggify.server.addPage("/api/stats", "post", lien => {
        const user = Session.getUser(lien);
        if (!user) {
            return lien.next();
        }

        const ev = {
            actor: user._id,
            event: lien.data.event,
            metadata: lien.data.metadata || {}
        };

        ev.metadata.user_agent = lien.header("user-agent");

        Settings.get((err, settings) => {
            if (settings) {
                ev.metadata.phase = settings.settings.hack_types[user.profile.hack_type].phase;
            }
            Stats.record(ev, (err, data) => {
                if (err) {
                    return lien.apiError(err);
                }
                lien.apiMsg("success");
            });
        });
    });

    Bloggify.on("topic:updated", topic => {
        Bloggify.wsNamespaces.topic.emit("updated", topic);
    });

    Bloggify.on("topic:created", topic => {
        Bloggify.wsNamespaces.topic.emit("created", topic);
        Notifications.topicCreated(topic);
    });

    Bloggify.on("comment:posted", comment => {
        Notifications.commentPosted(comment);
    });

    Bloggify.on("comment:created", comment => {
        Topic.getPopulated(comment.topic, (err, topic) => {
            if (err) { return Bloggify.log(err); }
            User.get({
                filters: {
                    _id: comment.author
                }
            }, (err, author) => {
                if (err) { return Bloggify.log(err); }
                comment = comment.toObject();
                comment.author = author.toObject();
                comment.topic = topic;
                Bloggify.emit("comment:posted", comment);
            });
        }, {
            userFields: {}
        });
    });

    Bloggify.websocket = SocketIO(Bloggify.server.server);
    Bloggify.wsNamespaces = {
        topic: Bloggify.websocket.of("/topic")
    };

    Bloggify.wsNamespaces.topic.use((socket, next) => {
        Bloggify.server.session(socket.handshake, {}, next);
    });

    Bloggify.wsNamespaces.topic.use((socket, next) => {
        if (!Object(socket.handshake.session._sessionData).user) {
            return next(new Error("You are not authenticated."));
        }
        next();
    });

    Bloggify.require("github-login", GitHub => {
        GitHub.on("login-error", (err, lien) => {
            console.error(err);
            lien.redirect("/");
        });
        GitHub.on("login-success", (token, user, lien) => {
            User.get({
                username: user.login
            }, (err, existingUser) => {
                if (err) {
                    Bloggify.log(err);
                    return lien.redirect("/");
                }

                if (existingUser) {
                    return Session.loginUser(existingUser, lien);
                }

                const newUser = new Bloggify.models.User({
                    username: user.login,
                    email: user.emails[0].email,
                    password: idy(),
                    profile: {
                        bio: user.bio,
                        website: user.blog,
                        full_name: user.name,
                        picture: user.avatar_url,
                        github_username: user.login
                    }
                });

                lien.startSession({
                    new_user: newUser.toObject()
                });
                lien.redirect("/register");
            });
        });
    });
};
