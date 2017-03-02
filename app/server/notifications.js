const Bloggify = require("bloggify");
const Email = Bloggify.require("sendgrid", true);
const uniq = require("array-unique");
const User = require("../controllers/User");

const FROM_EMAIL = "noreply@ironhacks.com";
const FROM_NAME = "IronHacks";

const EMAIL_TEMPLATES = {
    NEW_COMMENT: "90584722-937c-4298-8168-66b1f281df41",
    NEW_TOPIC: "7d42ff32-0196-40d2-a444-71a5d3635810"
};

const log = (err, data) => {
    if (err) { return Bloggify.log(err); }
    if (process.env.NODE_ENV !== "production") {
        console.log(err, data);
    }
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
            "-message-": comment.body,
            "-commentAuthorUsername-": comment.author.username,
            "-commentAuthorUrl-": `${Bloggify.options.metadata.domain}/users/${comment.author.username}`,
            "-topicUrl-": `${Bloggify.options.metadata.domain}${comment.topic.url}`,
            "-topicTitle-": comment.topic.title
        }
    }, log);
};

exports.topicCreated = topic => {
    User.model.find({
        "profile.hack_type": topic.metadata.hack_type
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

        console.log(emails);

        Email.send({
            to_email: emails
          , from_email: FROM_EMAIL
          , from_name: FROM_NAME
          , subject: "A new topic was posted: ‘" + topic.title + "’"
          , template_id: EMAIL_TEMPLATES.NEW_TOPIC
          , substitutions: {
                "-topicUrl-": `${Bloggify.options.metadata.domain}${topic.url}`,
                "-topicTitle-": topic.title
            }
        }, log);
    });
};
