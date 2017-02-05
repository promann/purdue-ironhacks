import React from "react";
import List from "./list";

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData.user
          , hackers:  window._pageData.hackers
        };
    }
    render () {
        return (
            <div>
                <List hackers={this.state.hackers} user={this.state.user} />
            </div>
        );
    }
}
