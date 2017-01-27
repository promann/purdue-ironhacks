import moment from "moment";

export default {
    normalizeTopic (topic) {
        topic.created_at = moment(topic.created_at);
        return topic;
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
        return fetch(url).then(c => c.json())
    }
};
