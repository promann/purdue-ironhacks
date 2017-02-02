module.exports = class Stats {
    static record (data, cb) {
        data.created_at = new Date();
        return StatModel(data).save(cb);
    }
};

let StatModel = null;
setTimeout(function() {
    StatModel = Bloggify.models.Stats
}, 1000);
