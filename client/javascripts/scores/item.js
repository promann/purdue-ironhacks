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
        const btn = <button className="btn btn-small" onClick={this.toggleScores.bind(this)}>
            {(this.state.opened ? "Hide" : "View") +  " scores"}
        </button>;
        return <td>{btn}</td>
    }
    render () {

        const scoreColumns = [
            [this.props.hacker.score_technical, "Score Technical"]
          , [this.props.hacker.score_info_viz, "Score Info Viz"]
          , [this.props.hacker.score_novelty, "Score Novelty"]
          , [this.props.hacker.score_total, "Score Total"]
        ].map((c, i) => {
            return <td key={i} data-label={`${c[1]}: `}>{this.state.opened ? `${(c[0] || 0).toFixed(2)}%` : ""}</td>
        });

        const projectLinks = [
            this.props.showProjectColumn ? [this.props.hacker.project_url, "Project"] : null
          , this.props.showGitHubRepoColumn ? [this.props.hacker.github_repo_url, "GitHub"] : null
        ].filter(Boolean).map((c, i) => {
            if (!c[0]) { return <td key={i} />; }
            return <td key={i} data-label={`${c[1]}: `}>
                <a target="_blank" href={c[0]} data-event={i ? "click-github-repo-url" : "click-project-url"} onClick={this.onLinkClick.bind(this)} data-label={c[1]}>
                    Click
                </a>
            </td>
        });

        return (
            <tr className="score-item">
                <td data-label="Username: " className="username">{this.props.hacker.username}</td>
                {this.renderViewButton()}
                {scoreColumns}
                {projectLinks}
            </tr>
        );
    }
}
