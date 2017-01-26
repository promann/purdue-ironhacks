import React from "react";
import CsrfInput from "../util/csrf-input";
import Editor from "react-md-editor";

export default class TopicEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            topic: window._pageData.topic,
            user: window._pageData.user
        };
    }

    render () {
        const actionUrl = this.state.topic.url ? `${this.state.topic.url}/edit` : "/new";
        return (
            <form className="edit-topic" method="post" action={actionUrl}>
                <CsrfInput />
                <input ref="title" name="title" type="text" defaultValue={this.state.topic.title} />
                <textarea ref="body" name="body" hidden defaultValue={this.state.topic.body}></textarea>
                <Editor value={this.state.topic.body} onChange={this.updateBody.bind(this)} />
                <button>Submit</button>
            </form>
        );
    }

    updateBody (comment) {
        this.refs.body.value = comment;
    }
}
