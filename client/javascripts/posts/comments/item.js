import React from "react";
import ReactMarkdown from "react-markdown";

export default class TopicCommentsItem extends React.Component {
    render () {
        return (
            <div className="topic-comment-item">
                <ReactMarkdown source={this.props.body} escapeHtml="true" />
            </div>
        );
    }
}
