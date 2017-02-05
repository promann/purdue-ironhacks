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
                <div className="comment-content">
                    <ReactMarkdown source={this.props.body} escapeHtml={true} />
                    <hr />
                    <div className="comment-metadata">
                        <a href={`/users/${this.props.author.username}`} className="comment-profile-link-text">
                            <span>{this.props.author.username}</span>
                        </a>,
                        {" "}
                        posted <span className="comment-date" title={createdAt.format("LLLL")}>{createdAt.fromNow()}</span>
                    </div>
                    <a href={`/users/${this.props.author.username}`} className="comment-profile-link">
                        <img title={this.props.author.username} src={this.props.author.profile.picture} />
                    </a>
                </div>
            </div>
        );
    }
}
