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
                <textarea ref="body" name="body" hidden defaultValue={this.state.topic.body}></textarea>
                <div className="form-section">
                    <input className="full-width" ref="title" name="title" type="text" placeholder="Topic title" defaultValue={this.state.topic.title} autoFocus />
                </div>
                <div className="form-section">
                    <p>Write the topic content below.  Styling with Markdown is supported.</p>
                    <Editor value={this.state.topic.body} onChange={this.updateBody.bind(this)} />
                </div>
                <div className="form-section">
                    <label><input ref="sticky" name="sticky" type="checkbox" defaultChecked={this.state.topic.sticky} /> Make this a sticky post. Stiky posts appear on the top of the page.</label>
                </div>
                <div className="form-section">
                    <button className="btn">Submit</button>
                </div>
            </form>
        );
    }

    updateBody (comment) {
        this.refs.body.value = comment;
    }
}
