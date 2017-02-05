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
            return <span className="post-info-section">
                <a href={`${this.props.url}/edit`}>Edit</a>
            </span>;
        }
        return "";
    }

    render () {
        let itemNumber = this.props.itemNumber ? <div className="item-number">{this.props.itemNumber}</div> : "";
        let commentsCount = this.props.comments.length;
        return (
            <div className={`post-item ${this.props.sticky ? "topic-sticky" : "topic-not-sticky"}`}>
                {itemNumber}
                {this.renderUpvote()}
                <div className="topic-content">
                    <a href={this.props.url} className="post-item-title">
                        <h2>
                            {this.props.title}
                        </h2>
                    </a>
                    <div className="post-info">
                        <span className="post-info-section">
                            <a href={`/users/${this.props.author.username}`}>
                                <strong>{this.props.author.username}</strong>
                            </a>
                        </span>
                        <span className="post-info-section">
                            {this.props.votes.length} <i className="fa fa-heart" aria-hidden="true"></i>
                        </span>
			{" | "}
                        <span className="post-info-section">
                            {this.props.created_at.fromNow()}
                        </span>
			{" | "}
                        <span className="post-info-section">
                            {commentsCount} Comment{commentsCount!== 1 ? "s" : ""}
                        </span>
                        {this.renderEdit()}
                        <div className="comments-count">
                            <i className="fa fa-comment-o" aria-hidden="true"></i>
                            <span className="comments-number">{commentsCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
