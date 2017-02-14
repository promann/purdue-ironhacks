import React from "react";
import Item from "./item";

export default class ScoreList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showProjectColumn: this.props.hackers.some(c => (c.project_url || "").trim())
          , showGitHubRepoColumn: this.props.hackers.some(c => (c.github_repo_url || "").trim())
        };
    }
    renderItems () {
        return this.props.hackers.map((c, i) => {
            return <Item hacker={c} user={this.props.user} key={i} showProjectColumn={this.state.showProjectColumn} showGitHubRepoColumn={this.state.showGitHubRepoColumn} />
        });
    }
    renderTheadRow () {

        const projectTd = this.state.showProjectColumn ? <td>Project</td> : null
            , githubTd = this.state.showGitHubRepoColumn ? <td>GitHub</td> : null
            ;

        return <tr>
            <td>Name</td>
            <td>Toggle Scores</td>
            <td>Technical Score</td>
            <td>Info Viz Score</td>
            <td>Novelty Score</td>
            <td>Total Score</td>
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
