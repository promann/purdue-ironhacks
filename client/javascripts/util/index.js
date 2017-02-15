import moment from "moment";
import "whatwg-fetch";

export default {
    normalizeTopic (topic) {
        topic.created_at = moment(topic.created_at);
        return topic;
    }
  , topicUrl (topicId) {
        if (topicId._id) {
            topicId = topicId._id;
        }
        return `/posts/${topicId}-topic`;
    }
  , post (url, data) {
        data._csrf = data._csrf || _pageData.csrfToken;
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(data)
        });
    }
  , getJSON (url) {
        return fetch(url, {
            credentials: "same-origin"
        }).then(c => c.json())
    }
};
