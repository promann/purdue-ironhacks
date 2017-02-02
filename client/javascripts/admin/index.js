import React from "react";
import util from "../util";
import setOrGet from "set-or-get";
import AdminUniversities from "./universities";
import $ from "elly";
import { $$ } from "elly";

const PHASES = [
    ["Phase 1", "phase1"]
  , ["Phase 2", "phase2"]
  , ["Phase 3", "phase3"]
  , ["Phase 4", "phase4"]
];

export default class App extends React.Component {
    constructor (props) {
        super(props);
        const users = window._pageData.users;
        const univs = {};
        users.forEach(c => {
            const cUniv = setOrGet(univs, c.profile.university, {});
            setOrGet(cUniv, c.profile.hack_id, []).push(c);
        });
        this.state = {
            user: window._pageData.user
          , users: users
          , Universities: univs
          , phase: _pageData.settings.phase
        };
    }

    onPhaseChange () {
        this.setState({
            phase: document.getElementById("contest-phase").value
        });
    }

    saveUsers () {
        const users = $$(".user-item").map(c => {
            return {
                _id: c.dataset.id
              , update: {
                    project_url: $("[name='project_url']", c).value
                  , github_repo_url: $("[name='github_repo_url']", c).value
                  , score_technical: $("[name='score_technical']", c).value
                  , score_info_viz: $("[name='score_info_viz']", c).value
                  , score_novelty: $("[name='score_novelty']", c).value
                  , score_custom: $("[name='score_custom']", c).value
                }
            };
        });

        this.setState({ loading: true });
        util.post(location.pathname, {
            users,
            phase: document.getElementById("contest-phase").value
        }).then(c => {
            if (c.status > 400) { throw new Error("Cannot save the data."); }
            location.reload();
            //this.setState({ loading: false });
        }).catch(e => {
            this.setState({ loading: false });
            alert(e.message);
        });
    }

    renderLoader () {
        if (this.state.loading) {
            return <div className="loader-wrapper">
                <div className="loader">Saving...</div>
            </div>
        }
        return "";
    }
    render () {
        const options = PHASES.map((c, i) => <option key={i} value={c[1]}>{c[0]}</option>);
        return (
            <div className="admin-view">
                <div className="phase-select-wrapper">
                    <select value={this.state.phase} id="contest-phase" className="phase-select" onChange={this.onPhaseChange.bind(this)}>
                        {options}
                    </select>
                </div>
                {this.renderLoader()}
                <AdminUniversities phase={this.state.phase} universities={this.state.Universities} />
                <button onClick={this.saveUsers.bind(this)} className="save-btn btn btn-big full-width">Save</button>
            </div>
        );
    }
}
