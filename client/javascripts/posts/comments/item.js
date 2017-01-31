import React from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import UpvoteCommentItem from "./upvote-comment-item";

export default class TopicCommentsItem extends React.Component {
    renderVotes () {
        const user = _pageData.user;
        if (!user) {
            return "";
        }
        return <UpvoteCommentItem {...this.props} user={user}/>
    }
    render () {
        const createdAt = moment(this.props.created_at);
        return (
            <div className="topic-comment-item">
                {this.renderVotes()}
                <ReactMarkdown source={this.props.body} escapeHtml={true} />
                by <a href={`/users/${this.props.author.username}`}><span>{this.props.author.username}</span></a> <span>{createdAt.fromNow()}</span>
            </div>
        );
    }
}
