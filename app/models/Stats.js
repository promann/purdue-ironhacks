const StatsSchema = new Bloggify.db.Schema({
    actor: String,
    metadata: Object,
    event: String,
    created_at: Date
})

StatsSchema.statics.record = (data, cb) => {
    data.created_at = new Date()
    return Stats(data).save(cb)
}

const Stats = module.exports = Bloggify.db.model("Stats", StatsSchema)
