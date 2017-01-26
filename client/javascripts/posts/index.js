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
        this.socket = io.connect("/topic");
        this.socket.on("updated", topic => {
            const topics = this.state.topics;
            for (let t of topics) {
                if (t._id === topic._id) {
                    topics[topics.indexOf(t)] = util.normalizeTopic(topic);
                    this.setState({ topics });
                    return;
                }
            }
        });
        fetch("/api/posts")
            .then(c => c.json())
            .then(topics => {
                topics.forEach(util.normalizeTopic);
                this.setState({ topics })
            })
    }
    render () {
        return (
            <div>
                <a href="/new">Post</a>
                <TopicsList topics={this.state.topics} />
            </div>
        );
    }
}
