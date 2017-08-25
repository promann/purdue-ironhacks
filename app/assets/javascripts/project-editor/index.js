import React from "react";
import brace from "brace";
import AceEditor from "react-ace";
import BloggifyActions from "bloggify.js/http-actions";
import FolderTree from "react-folder-tree";
import {Treebeard, decorators} from "react-treebeard";

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/theme/monokai';

// Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title} onClick={node.onClick}>
                <i className={iconClass} style={iconStyle}/>
                {node.name}
            </div>
        </div>
    );
};

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            page: window._pageData,
            filepath: "index.html",
            file_content: "",
            reloading_preview: true,
            preview_filepath: "index.html"
        };

        BloggifyActions.post("project.listFiles", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
        }).then(files => {
            this.setState({ files });
        });

        this.editor_content = "";
        this.openFile(this.state.filepath);

        window.addEventListener("keydown", event => {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        this.saveFile()
                        break;
                }
            }
        })
    }

    openFile (path) {
        this.editor_content = ""
        BloggifyActions.post("project.getFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: path
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
        this.setState({
            reloading_preview: true
        })
        BloggifyActions.post("project.saveFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: this.state.filepath,
            content: this.editor_content
        }).then(() => {
            this.reloadPreview()
        }).catch(err => {
            alert(err.message);
        });
    }

    onEditorContentChange (content) {
        this.editor_content = content;
    }

    renderFolderTree () {
        if (this.state.files) {
            const walk = obj => {
                obj.active = false;
                obj._path = obj.path.split("/").slice(2).join("/");
                obj.onClick = () => {
                    this.openFile(obj._path)
                }
                if (obj._path === this.state.filepath) {
                    obj.active = true
                }
                if (obj.children) {
                    for (let i = 0; i < obj.children.length; ++i) {
                        walk(obj.children[i])
                    }
                }
            }
            walk(this.state.files)
            return <Treebeard
                data={this.state.files}
            />

        }
        return <p>Loading...</p>;
    }

    reloadPreview () {
        const iframe = document.getElementById("preview-iframe")
        iframe.src = iframe.src
    }

    previewLoaded () {
        this.setState({
            reloading_preview: false
        })
    }

    render () {
        const previewFileUrl = `/users/${_pageData.project.username}/projects/${_pageData.project.name}/preview/${this.state.preview_filepath}`
        return (
            <div>
                <div className="row editor-container">
                    <div className="col file-tree-column">
                        <div className="editor-controls">
                            <button className="btn btn-small" onClick={this.saveFile.bind(this)}>Save</button>
                        </div>
                        {this.renderFolderTree()}
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col editor-column">
                                <AceEditor
                                    mode="html"
                                    theme="monokai"
                                    value={this.editor_content || this.state.file_content}
                                    onChange={this.onEditorContentChange.bind(this)}
                                    name="project-ace-editor"
                                    width="100%"
                                    height="100%"
                                    editorProps={{
                                        $blockScrolling: true,
                                    }}
                                />
                            </div>
                            <div className="col preview-column">
                                <div className={`editor-preview ${this.state.reloading_preview ? "reloading-preview" : "loaded-preview"}`}>
                                    <div className="open-in-new-tab">
                                        <a href={previewFileUrl} target="blank">Open in New Tab</a>
                                    </div>
                                    <iframe src={previewFileUrl} id="preview-iframe" className="editor-preview-iframe" onLoad={this.previewLoaded.bind(this)} />
                                    <div className="iframe-spinner">
                                        Loading...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
