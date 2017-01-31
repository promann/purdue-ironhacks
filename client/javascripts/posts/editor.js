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
                <div>
                    <input ref="title" name="title" type="text" defaultValue={this.state.topic.title} />
                </div>
                <div>
                    <label><input ref="sticky" name="sticky" type="checkbox" defaultChecked={this.state.topic.sticky} /> Sticky post</label>
                </div>
                <div>
                    <textarea ref="body" name="body" hidden defaultValue={this.state.topic.body}></textarea>
                </div>
                <div>
                    <Editor value={this.state.topic.body} onChange={this.updateBody.bind(this)} />
                </div>
                <div>
                    <button>Submit</button>
                </div>
            </form>
        );
    }

    updateBody (comment) {
        this.refs.body.value = comment;
    }
}
