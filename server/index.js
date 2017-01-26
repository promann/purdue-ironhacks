const Topic = require("../controllers/Topic")
    , SocketIO = require("socket.io")
    ;

module.exports = bloggify => {
    global.Bloggify = bloggify;
    Bloggify.server.addPage("/api/posts", lien => {
        Topic.getMore(lien.query, (err, data) => {
            if (err) {
                return lien.apiError(err);
            }
            lien.end(data);
        });
    });

    Bloggify.websocket = SocketIO(Bloggify.server.server);
    Bloggify.wsNamespaces = {
        topic: Bloggify.websocket.of("/topic")
    };
};
