import React from "react";
import brace from "brace";
import AceEditor from "react-ace";
import BloggifyActions from "bloggify.js/http-actions";
import FolderTree from "react-folder-tree";

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/theme/monokai';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            page: window._pageData,
            filepath: "index.html",
            file_content: ""
        };

        BloggifyActions.post("project.listFiles", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
        }).then(files => {
            this.setState({ files });
        });

        this.editor_content = "";
        this.openFile(this.state.filepath);
    }

    openFile (path) {
        BloggifyActions.post("project.getFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: this.state.filepath
        }).then(data => {
            this.setState({
                file_content: data.Body,
                filepath: path
            });
        }).catch(err => {
            alert(err.message);
        });
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

    renderFolderTree () {
        if (this.state.files) {
            return <FolderTree
                data={this.state.files}
                showToolbar={true}
            />
        }
        return <p>Loading...</p>;
    }

    render () {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        {this.renderFolderTree()}
                    </div>
                    <div className="col">
                        <AceEditor
                            mode="html"
                            theme="monokai"
                            value={this.state.file_content}
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
