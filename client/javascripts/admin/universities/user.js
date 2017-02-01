import React from "react";

export default class UserItem extends React.Component {
    render () {
        return (
            <div className="user-item" data-id={this.props.user._id}>
                <div className="username">
                    <span className="user-label">Username:</span> {this.props.user.username}
                </div>
                <div className="email">
                   <span className="user-label">Email:</span> {this.props.user.email}
                </div>
                <div className="project-url">
                    <span className="user-label">Project URL:</span> <input type="text" name="project_url" defaultValue={this.props.user.profile.project_url} />
                </div>
                <div className="github-repo-url">
                    <span className="user-label">GitHub Repository URL:</span> <input type="text" name="github_repo_url" defaultValue={this.props.user.profile.github_repo_url} />
                </div>
                <div className="score-technical">
                    <span className="user-label">Technical score:</span> <input type="number" name="score_technical" defaultValue={this.props.user.profile.score_technical} />
                </div>
                <div className="score-info-viz">
                    <span className="user-label">Info Viz Score:</span> <input type="number" name="score_info_viz" defaultValue={this.props.user.profile.score_info_viz} />
                </div>
                <div className="score-novelty">
                    <span className="user-label">Novelty Score:</span> <input type="number" name="score_novelty" defaultValue={this.props.user.profile.score_novelty} />
                </div>
            </div>
        );
    }
}
