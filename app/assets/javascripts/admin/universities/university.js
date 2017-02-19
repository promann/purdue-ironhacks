import React from "react";
import HackItem from "./hack";
import forEach from "iterate-object";

export default class AdminUniversityItem extends React.Component {
    renderItems () {
        const items = [];
        let index = -1;
        forEach(this.props.university, (hackObj, hackId) => {
            if (typeof hackObj === "string") { return; }
            hackObj.id = hackId;
            items.push(<HackItem hack={hackObj} key={++index} phases={this.props.phases} />);
        });
        return items;
    }
    render () {
        return (
            <div>
                <h2>University: <span className="university-name">{this.props.university.name}</span></h2>
                {this.renderItems()}
            </div>
        );
    }
}
