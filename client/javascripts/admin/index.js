import React from "react";
import util from "../util";
import setOrGet from "set-or-get";
import AdminUniversities from "./universities";

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
    render () {
        return (
            <div>
                <AdminUniversities universities={this.state.Universities} />
            </div>
        );
    }
}
