import React from "react";
import util from "../util";

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
        util.post(`${this.props.url}/toggle-vote`, {
            topic: this.props._id
        })
    }
}
