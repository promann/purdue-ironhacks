import React from "react";
import util from "../util";
import setOrGet from "set-or-get";
import AdminUniversities from "./universities";
import $ from "elly";
import { $$ } from "elly";
import forEach from "iterate-object";
import moment from "moment";

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

        const phases = {};
        forEach(_pageData.settings.universities, (uni, name) => {
            phases[name] = uni.phase;
        });

        this.state = {
            user: window._pageData.user
          , users: users
          , Universities: univs
          , phases: phases
        };
    }

    onPhaseChange (e) {
        this.state.phases[e.target.dataset.university] = e.target.value;
        this.setState({
            phases: this.state.phases
        });
    }

    saveUsers () {
        const users = $$(".user-item").map(c => {
            return {
                _id: c.dataset.id
              , university: $("[name='user-university']", c).value
              , update: {
                    project_url: $("[name='project_url']", c).value
                  , github_repo_url: $("[name='github_repo_url']", c).value
                  , score_technical: $("[name='score_technical']", c).value
                  , score_info_viz: $("[name='score_info_viz']", c).value
                  , score_novelty: $("[name='score_novelty']", c).value
                  , score_custom: $("[name='score_custom']", c).value
                  , role: $("[name='role']", c).value
                }
            };
        });

        const universities = {};
        $$(".uni-start-date").forEach(c => {
            let input = $("input", c);
            universities[input.dataset.university] = {start_date: input.value };
        });

        $$(".uni-subgroup").forEach(c => {
            let input = $("input", c);
            universities[input.dataset.university].subforums_count = (input.value - 1) || 0;
        });

        $$(".uni-phase-selector").forEach(c => {
            const select = $("select", c);
            universities[select.dataset.university].phase = select.value;
        });

        this.setState({ loading: true });
        util.post(location.pathname, {
            users,
            universities
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

    renderPhaseSelector () {
        const hackTypes = [];
        let index = -1;

        forEach(window._pageData.settings.universities, (univ, name) => {
            const options = PHASES.map((c, i) => <option key={i} value={c[1]}>{c[0]}</option>);
            hackTypes.push(
                <div className="uni-phase-selector" key={++index} >
                    <strong className="university-name">{name}</strong>: <br/>
                    <div className="phase-select-wrapper">
                        <select data-university={name} value={this.state.phases[name]} className="phase-select" onChange={this.onPhaseChange.bind(this)}>
                            {options}
                        </select>
                    </div>
                </div>
            );
        });

        return hackTypes;
    }

    render () {
        const universitiesStartDates = []
        const universitiesSubforums = []
        let index = -1;

        forEach(window._pageData.settings.universities, (univ, name) => {
            univ.start_date = moment(new Date(univ.start_date));
            univ.subforums_count = univ.subforums_count || 0;
            universitiesStartDates.push(
                <div className="uni-start-date" key={++index} >
                    <strong>{name}</strong>: <br/><input data-university={name} type="text" defaultValue={univ.start_date.format("YYYY-MM-DD HH:mm:ss")} />
                </div>
            );
            universitiesSubforums.push(
                <div className="uni-subgroup" key={index} >
                    <strong className="university-name">{name}</strong> ({_pageData.users.filter(c => c.profile.university === name).length} students): <br/>
                    <input data-university={name} type="number" defaultValue={univ.subforums_count + 1} />
                </div>
            );
        });

        return (
            <div className="admin-view">
                <div className="row">
                    <div className="col">
                        <h2>Select Phase</h2>
                        <p>Select the phase for each hack type and then click the save button.</p>
                        {this.renderPhaseSelector()}
                        <h2>Start Dates</h2>
                        <p><strong>Tip:</strong> Use a past date to force starting of the contest.</p>
                        {universitiesStartDates}
                        <h2>Forum subgroups</h2>
                        <p>Decide how many subforums you want for each university.</p>
                        {universitiesSubforums}
                    </div>
                    <div className="col">
                        <h2>Download CSV Stats</h2>
                        <a className="btn" href="/admin/csv/topics">Topics</a>
                        {" "}
                        <a className="btn" href="/admin/csv/scores">Scores</a>
                    </div>
                </div>

                <h1>Users</h1>
                <p>You can update the scores and then click the save button. The custom score, if provided, will override the total.</p>
                {this.renderLoader()}
                <AdminUniversities phases={this.state.phases} universities={this.state.Universities} />
                <button onClick={this.saveUsers.bind(this)} className="save-btn btn btn-big full-width">Save</button>
                <button onClick={this.saveUsers.bind(this)} className="circle-save-btn btn btn-big" title="Save changes"><i className="fa fa-check" aria-hidden="true"></i></button>
            </div>
        );
    }
}
