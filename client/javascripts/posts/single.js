import React from "react";
import TopicsListItem from "./topics-list-item";
import TopicComments from "./comments/list";
import CommentForm from "./comments/form";
import moment from "moment";
import ReactMarkdown from "react-markdown";

export default class App extends React.Component {
    constructor (props) {
        super(props);
        const topic = window._pageData.topic;
        topic.created_at = moment(topic.created_at);
        this.state = {
            topic: topic,
            user: window._pageData.user
        };
    }
    renderCommentForm () {
        if (!this.state.user) {
            return (<p><a href="/">Sign in</a> to comment.</p>);
        }
        return <CommentForm topic={this.state.topic} />
    }
    render () {
        return (
            <div>
                <TopicsListItem
                    {...this.state.topic}
                />
                <ReactMarkdown source={this.state.topic.body} escapeHtml="true"/>
                <TopicComments comments={this.state.topic.comments} />
                {this.renderCommentForm()}
            </div>
        );
    }
}
