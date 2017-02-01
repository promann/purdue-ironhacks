import React from "react";
import util from "../util";
import setOrGet from "set-or-get";
import AdminUniversities from "./universities";
import $ from "elly";
import { $$ } from "elly";

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
        };
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
                }
            };
        });

        this.setState({ loading: true });
        util.post(location.pathname, {
            users
        }).then(c => {
            if (c.status > 400) { throw new Error("Cannot save the data."); }
            this.setState({ loading: false });
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
        return (
            <div className="admin-view">
                {this.renderLoader()}
                <AdminUniversities universities={this.state.Universities} />
                <button onClick={this.saveUsers.bind(this)} className="save-btn btn btn-big full-width">Save</button>
            </div>
        );
    }
}
