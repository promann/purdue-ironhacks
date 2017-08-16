import React from "react";
import brace from "brace";
import AceEditor from "react-ace";
import BloggifyActions from "bloggify.js/http-actions";

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/theme/github';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            page: window._pageData,
            filepath: "index.html"
        };
        this.editor_content = "";
    }
    saveFile () {
        console.log(this.editor_content);
        BloggifyActions.post("project.saveFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: this.state.filepath,
            content: this.editor_content
        }).catch(err => {
            alert(err.message);
        });
    }
    onEditorContentChange (content) {
        this.editor_content = content;
    }
    render () {
        return (
            <div>
                <div className="row">
                    <div className="col">
                    </div>
                    <div className="col">
                        <AceEditor
                            mode="html"
                            theme="github"
                            onChange={this.onEditorContentChange.bind(this)}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{$blockScrolling: true}}
                        />
                        <button className="btn" onClick={this.saveFile.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
