import React from "react";

export default class TopicsListItem extends React.Component {
    render () {
        return (
            <div className="post-item">
                <a href={this.props.url} className="post-item-title">
                    <h2>
                        {this.props.title}
                    </h2>
                </a>
                <div className="post-info">
                    By <a href={`/users/${this.props.author.username}`}>{this.props.author.username}</a> |
                    {this.props.created_at.fromNow()} |
                    {this.props.comments.length} Comments
                </div>
            </div>
        )
    }
}
