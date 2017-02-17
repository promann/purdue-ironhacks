module.exports = {
    author: "string",
    title: {
        type: String,
        text: true
    },
    slug: "string",
    body: {
        type: String,
        text: true
    },
    created_at: "date",
    votes: ["string"],
    sticky: "boolean",
    metadata: "object"
};
