module.exports = {
    author: {
        type: String,
        index: true
    },
    body: {
        type: String,
        text: true
    },
    created_at: {
        type: Date,
        index: true
    },
    topic: {
        type: String,
        index: true
    },
    votes: [String]
};
