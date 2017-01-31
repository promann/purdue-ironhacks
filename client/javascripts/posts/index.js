import React from "react";
import TopicsList from "./topics-list";
import io from "socket.io-client";
import util from "../util";

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData
          , topics: null
        };
        let updateTopics = topics => {
            const sticky = [];
            const nonSticky = [];
            topics.sort((a, b) => {
                return a.created_at < b.created_at ? 1 : -1
            });
            topics.forEach(c => {
                if (c.sticky) {
                    sticky.push(c);
                } else {
                    nonSticky.push(c);
                }
            });

            this.setState({ topics: sticky.concat(nonSticky) });
        };

        this.socket = io.connect("/topic");
        this.socket.on("created", topic => {
            const topics = this.state.topics;
            util.normalizeTopic(topic)
            topics.unshift(topic);
            updateTopics(topics);
        });
        this.socket.on("updated", topic => {
            const topics = this.state.topics;
            for (let t of topics) {
                if (t._id === topic._id) {
                    topics[topics.indexOf(t)] = util.normalizeTopic(topic);
                    updateTopics(topics);
                    return;
                }
            }
        });
        util
          .getJSON("/api/posts")
          .then(topics => {
              topics.forEach(util.normalizeTopic);
              updateTopics(topics);
          })
    }
    render () {
        return (
            <div>
                <a className="full-width btn-big bgn-green text-center bold btn" href="/new">Post a new topic</a>
                <TopicsList topics={this.state.topics} />
            </div>
        );
    }
}
