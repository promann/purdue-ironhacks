import React from "react";
import util from "../../util";

export default class UpvoteCommentItem extends React.Component {

    get upvoted () {
        return this.props.votes.includes(this.props.user._id)
    }

    render () {
        return (
            <span className="upvote-comment">
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
        util.post(`${location.pathname}/comments`, {
            comment: this.props._id,
            toggleVote: "on"
        });
    }
}
