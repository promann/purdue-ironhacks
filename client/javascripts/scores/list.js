import React from "react";
import Item from "./item";

export default class ScoreList extends React.Component {
    renderItems () {
        return this.props.hackers.map((c, i) => {
            return <Item hacker={c} user={this.props.user} key={i} />
        });
    }
    render () {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Toggle Scores</td>
                            <td>Technical Score</td>
                            <td>Info Viz Score</td>
                            <td>Novelty Score</td>
                            <td>Total Score</td>
                            <td>Project</td>
                            <td>GitHub</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderItems()}
                    </tbody>
                </table>
            </div>
        );
    }
}
