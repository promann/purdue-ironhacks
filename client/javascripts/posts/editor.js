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

    renderAdminFields () {
        if (location.pathname !== "/new" || _pageData.isAdmin) {
            return;
        }
        return <div className="form-section">
            <h3>University</h3>
            <select name="university">
                <option value="purdue">Purdue</option>
                <option value="bogota">Bogota</option>
                <option value="platzi">Platzi</option>
            </select>

            <h3>Hack ID</h3>
            <p>This should be <code>0</code> for Purdue, and 0, 1 or 2 for the others.</p>
            <input name="hackId" type="number" placeholder="Hack Id" defaultValue="0" min="0" max="2"/>
        </div>
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
                {this.renderAdminFields()}
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
