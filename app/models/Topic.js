module.exports = {
    author: {
        type: String,
        index: true
    },
    title: {
        type: String,
        text: true
    },
    slug: {
        type: String,
        index: true
    },
    body: {
        type: String,
        text: true
    },
    created_at: Date,
    votes: [String],
    sticky: "boolean",
    metadata: Object
};
