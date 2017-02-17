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

        if (!_pageData.isAdmin) {
            return null;
        }

        let formSectionSticky = <div className="form-section">
            <label><input ref="sticky" name="sticky" type="checkbox" defaultChecked={this.state.topic.sticky} /> Make this a sticky post. Sticky posts appear on the top of the page.</label>
        </div>;

        let formSectionTarget = null;

        if (location.pathname === "/new") {
            formSectionTarget = <div className="form-section">
                <div className="row">
                    <div className="col">
                        <h3>University</h3>
                        <p>Choose the university. Without changing these, you will post the topic on the forum you belong to.</p>
                        <select name="university" defaultValue={_pageData.user.profile.university}>
                            <option value="purdue">Purdue</option>
                            <option value="bogota">Bogota</option>
                            <option value="platzi">Platzi</option>
                        </select>
                    </div>
                    <div className="col">
                        <h3>Hack ID</h3>
                        <p>This should be <code>0</code> for Purdue, and 0, 1 or 2 for the others.</p>
                        <input name="hackId" type="number" placeholder="Hack Id" defaultValue="0" min="0" max="2" defaultValue={_pageData.user.profile.hack_id} />
                    </div>
                </div>
            </div>
        }

        return <div className="admin-area">
            <h3>Admin tools</h3>
            {formSectionTarget}
            {formSectionSticky}
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
                    <button className="btn">Submit</button>
                </div>
            </form>
        );
    }

    updateBody (comment) {
        this.refs.body.value = comment;
    }
}
