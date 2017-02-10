const Email = Bloggify.require("sendgrid", true);
const uniq = require("array-unique");
const User = require("../controllers/User");

const FROM_EMAIL = "noreply@ironhacks.com";
const FROM_NAME = "IronHacks";

const EMAIL_TEMPLATES = {
    NEW_COMMENT: "7d42ff32-0196-40d2-a444-71a5d3635810",
    NEW_TOPIC: "90584722-937c-4298-8168-66b1f281df41"
};

const log = (err, data) => {
    if (err) { return Bloggify.log(err); }
};

exports.commentPosted = comment => {
    const emails = uniq(comment.topic.comments.map(c => c.author.email).concat(comment.topic.author.email));
    const authorEmail = comment.author.email;
    uniq(emails);
    const authorIndex = emails.indexOf(authorEmail);
    if (~authorIndex) {
        emails.splice(authorIndex, 1);
    }

    Email.send({
        to_email: emails
      , from_email: FROM_EMAIL
      , from_name: FROM_NAME
      , subject: "A new comment was posted on ‘" + comment.topic.title + "’"
      , template_id: EMAIL_TEMPLATES.NEW_COMMENT
      , substitutions: {
            "-message-": `
<a href="${Bloggify.options.metadata.domain}/users/${comment.author.username}">@${comment.author.username}</a> posted a new comment on ‘<a href="${Bloggify.options.metadata.domain}${comment.topic.url}">${comment.topic.title}</a>’:<br>
<blockquote>${comment.body}</blockquote>`
        }
    }, log);
};

exports.topicCreated = topic => {
    User.model.find({
        "profile.university": topic.metadata.university
      , "profile.hack_id": topic.metadata.hack_id
    }, {
        email: 1
    }, (err, docs) => {
        const emails = docs.map(c => c.email);
        const authorEmail = topic.author.email;
        uniq(emails);
        const authorIndex = emails.indexOf(authorEmail);

        if (~authorIndex) {
            emails.splice(authorIndex, 1);
        }

        Email.send({
            to_email: emails
          , from_email: FROM_EMAIL
          , from_name: FROM_NAME
          , subject: "A new topic was posted: ‘" + topic.title + "’"
          , template_id: EMAIL_TEMPLATES.NEW_TOPIC
          , substitutions: {
                "-message-": `<a href="${Bloggify.options.metadata.domain}/users/${topic.author.username}">@${topic.author.username}</a> posted a new topic: ‘<a href="${Bloggify.options.metadata.domain}/${topic.url}-">${topic.title}</a>’.`
            }
        }, log);
    });
};
