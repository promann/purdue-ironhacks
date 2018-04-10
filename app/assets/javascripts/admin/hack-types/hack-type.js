import React from "react";
import HackItem from "./hack";
import forEach from "iterate-object";

export default class AdminHackTypeItem extends React.Component {
    renderItems () {
        const items = [];
        let index = -1;
        forEach(this.props.hackType, (hackObj, hackId) => {
            if (typeof hackObj === "string") { return; }
            hackObj.id = hackId;
            items.push(<HackItem hack={hackObj} key={++index} phases={this.props.phases} />);
        });
        return items;
    }
    render () {
        console.log(this.props.hackType.name)
        console.log(this.props.hackType.name == 'undefined')
        this.props.hackType.name == "undefined"
        if(this.props.hackType.name != 'undefined'){ 
            return (
                <div>
                    <h2>HackType: <span className="hack-type-name">{_pageData.hackTypes[this.props.hackType.name].label}</span></h2>
                    {this.renderItems()}
                </div>
            );
        }else{
            return (<div>lalalalallalalallalal</div>)
        }
    }
}
