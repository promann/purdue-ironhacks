import React from "react";
import UpvoteTopicItem from "./upvote-topic-item";

export default class TopicsListItem extends React.Component {
    renderUpvote () {
        const user = _pageData.user;
        if (!user) {
            return "";
        }
        return <UpvoteTopicItem {...this.props} user={user}/>
    }

    renderEdit () {
        if (this.props.author._id === window._pageData.user._id) {
            return <span>| <a href={`${this.props.url}/edit`}>edit</a></span>
        }
        return "";
    }

    render () {
        return (
            <div className={`post-item ${this.props.sticky ? "topic-sticky" : "topic-not-sticky"}`}>
                <a href={this.props.url} className="post-item-title">
                    <h2>
                        {this.props.title}
                    </h2>
                </a>
                <div className="post-info">
                    {this.renderUpvote()}
                    {this.props.votes.length} Votes |
                    By <a href={`/users/${this.props.author.username}`}>{this.props.author.username}</a> |
                    {this.props.created_at.fromNow()} |
                    {this.props.comments.length} Comments
                    {this.renderEdit()}
                </div>
            </div>
        )
    }
}
