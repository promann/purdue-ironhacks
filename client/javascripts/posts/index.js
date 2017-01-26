import React from "react";
import TopicsList from "./topics-list";
import moment from "moment";

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData
          , topics: null
        };
        fetch("/api/posts")
            .then(c => c.json())
            .then(topics => {
                topics.forEach(c => {
                    c.created_at = moment(c.created_at);
                });
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
