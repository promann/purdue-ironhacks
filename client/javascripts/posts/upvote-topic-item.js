import React from "react";
import util from "../util";

export default class UpvoteTopicItem extends React.Component {
    get upvoted () {
        return this.props.votes.includes(this.props.user._id)
    }

    render () {
        return (
            <div className="upvote-topic">
                {this.renderUpvoteBtn()}
            </div>
        )
    }

    renderUpvoteBtn () {
        return <a href="#" className={this.upvoted ? "upvoted" : "not-upvoted"} onClick={this.toggleVote.bind(this)}>
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
        </a>;
    }

    toggleVote (e) {
        util.post(`${this.props.url}/toggle-vote`, {
            topic: this.props._id
        });
        e.preventDefault();
    }
}
