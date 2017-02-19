import React from "react";

export default class TopicFilters extends React.Component {

    refreshTopics () {
        const uniValue = this.refs.university.value;
        const hackIdValue = this.refs.hack_id.value;
        this.props.updateTopics(this.props.topics.filter(topic => {
            return (topic.metadata.university === uniValue || "All" === uniValue)
                && (+topic.metadata.hack_id === +hackIdValue || "All" === hackIdValue)
                ;
        }));
    }

    render () {
        let universityOptions = ["All"]
          , hackIdOptions = ["All"]
          ;

        this.props.topics.forEach(topic => {
            if (!universityOptions.includes(topic.metadata.university)) {
                universityOptions.push(topic.metadata.university);
            }
            if (!hackIdOptions.includes(+topic.metadata.hack_id)) {
                hackIdOptions.push(+topic.metadata.hack_id);
            }
        });

        universityOptions = universityOptions.map((c, i) => {
            return <option key={i} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        });

        hackIdOptions = hackIdOptions.map((c, i) => {
            return <option key={i} value={c}>{c}</option>
        });

        const universitySelect = <select defaultValue="All" ref="university" onChange={this.refreshTopics.bind(this)}>
            {universityOptions}
        </select>;

        const hackIdSelect = <select defaultValue="All" ref="hack_id" onChange={this.refreshTopics.bind(this)}>
            {hackIdOptions}
        </select>;

        return <span className="admin-filters">
            {universitySelect}
            {hackIdSelect}
        </span>;
    }
}
