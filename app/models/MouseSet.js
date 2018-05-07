// Mouse tracker model

const MouseSetSchema = new Bloggify.db.Schema({
    user_id: String,
    username: String,
    mouseSet: Object,
    date: Date
})

MouseSetSchema.statics.record = data => {
    return MouseSet(data).save()
}

const MouseSet = module.exports = Bloggify.db.model("MouseSet", MouseSetSchema)