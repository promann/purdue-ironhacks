const Topic = require("../controllers/Topic");

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
};
