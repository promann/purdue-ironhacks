import React from "react";
import Item from "./item";

export default class ScoreList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showProjectColumn: this.props.hackers.some(c => (c.project_url || "").trim())
          , showGitHubRepoColumn: this.props.hackers.some(c => (c.github_repo_url || "").trim())
          , showScores: this.props.hackers.some(c => c.score_total)
        };
    }
    renderItems () {
        return this.props.hackers.map((c, i) => {
            return <Item hacker={c} user={this.props.user} key={i} showProjectColumn={this.state.showProjectColumn} showGitHubRepoColumn={this.state.showGitHubRepoColumn} showScoresColumn={this.state.showScores} />
        });
    }
    renderTheadRow () {

        const projectTd = this.state.showProjectColumn ? <td>Project</td> : null
            , githubTd = this.state.showGitHubRepoColumn ? <td>GitHub</td> : null
            ;

        return <tr>
            <td>Name</td>
            { this.state.showScores ? <td>Toggle Scores</td> : null }
            { this.state.showScores ? <td>Technical Score</td> : null }
            { this.state.showScores ? <td>Info Viz Score</td> : null }
            { this.state.showScores ? <td>Novelty Score</td> : null }
            { this.state.showScores ? <td>Total Score</td> : null }
            {projectTd}
            {githubTd}
        </tr>
    }
    render () {
        return (
            <div>
                <table>
                    <thead>
                        {this.renderTheadRow()}
                    </thead>
                    <tbody>
                        {this.renderItems()}
                    </tbody>
                </table>
            </div>
        );
    }
}
