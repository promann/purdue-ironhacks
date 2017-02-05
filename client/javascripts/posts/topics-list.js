import React from "react";
import TopicsListItem from "./topics-list-item";

export default class TopicsList extends React.Component {
    renderItems () {
        return this.props.topics.map((c, index) => {
            return (
                <TopicsListItem
                    key={index}
                    itemNumber={index + 1}
                    {...c}
                    id={index}
                />
            )
        });
    }
    render () {
        if (!this.props.topics) {
            return <p>Loading...</p>;
        }
        if (!this.props.topics.length) {
            return <p className="tutorial">Create your first topic! :)</p>;
        }
        return (
            <div className="posts-list">
                <h1>Latest posts</h1>
                {this.renderItems()}
            </div>
        )
    }
}
