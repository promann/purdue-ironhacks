import React from "react";
import AdminUniversityItem from "./university";
import forEach from "iterate-object";

export default class AdminUniversities extends React.Component {

    renderItems () {
        const items = [];
        let index = -1;
        forEach(this.props.universities, (uni, name) => {
            uni.name = name;
            items.push(<AdminUniversityItem university={uni} key={++index} />);
        });
        return items;
    }

    render () {
        return (
            <div>
                {this.renderItems()}
            </div>
        );
    }
}
