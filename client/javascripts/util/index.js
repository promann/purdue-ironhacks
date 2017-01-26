import moment from "moment";

export default {
    normalizeTopic (topic) {
        topic.created_at = moment(topic.created_at);
        return topic;
    }
};
