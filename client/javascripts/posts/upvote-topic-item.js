import React from "react";

export default class UpvoteTopicItem extends React.Component {
    get upvoted () {
        return this.props.votes.includes(this.props.user._id)
    }

    render () {
        return (
            <span className="upvote-topic">
                {this.renderUpvoteBtn()}
            </span>
        )
    }

    renderUpvoteBtn () {
        return <button onClick={this.toggleVote.bind(this)}>
            { this.upvoted ? "Remove upvote" : "Upvote" }
        </button>
    }

    toggleVote () {
        fetch(`${this.props.url}/toggle-vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                topic: this.props._id
              , _csrf: _pageData.csrfToken
            })
        });
    }
}
