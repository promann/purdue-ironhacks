import React from "react";
import util from "../util";

export default class ScoreItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            opened: false
        };
    }
    toggleScores () {
        if (!this.state.opened) {
            util.post("/api/stats", {
                event: "score-click",
                metadata: {
                    hacker_id: this.props.hacker._id
                }
            });
        }
        this.setState({
            opened: !this.state.opened
        });
    }
    onLinkClick (e) {
        util.post("/api/stats", {
            event: e.target.dataset.event,
            metadata: {
                hacker_id: this.props.hacker._id,
                url: e.target.href
            }
        });
    }
    renderViewButton () {
        const btn = <button onClick={this.toggleScores.bind(this)}>
            {(this.state.opened ? "Hide" : "View") +  " scores"}
        </button>;
        return <td>{btn}</td>
    }
    render () {

        const scoreColumns = [
            this.props.hacker.score_technical
          , this.props.hacker.score_info_viz
          , this.props.hacker.score_novelty
          , this.props.hacker.score_total
        ].map((c, i) => {
            return <td key={i}>{this.state.opened ? c : ""}</td>
        });

        const projectLinks = [
            this.props.hacker.project_url
          , this.props.hacker.github_repo_url
        ].map((c, i) => {
            if (!c) { return <td key={i} />; }
            return <td key={i}>
                <a target="_blank" href={c} data-event={i ? "click-github-repo-url" : "click-project-url"} onClick={this.onLinkClick.bind(this)}>
                    Click
                </a>
            </td>
        });

        return (
            <tr className="score-item">
                <td className="username">{this.props.hacker.username}</td>
                {this.renderViewButton()}
                {scoreColumns}
                {projectLinks}
            </tr>
        );
    }
}
