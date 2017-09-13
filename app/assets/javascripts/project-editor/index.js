import React from "react";
import brace from "brace";
import AceEditor from "react-ace";
import BloggifyActions from "bloggify/http-actions";
import FolderTree from "react-folder-tree";
import {Treebeard, decorators} from "react-treebeard";

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/theme/monokai';

const DEFAULT_FILEPATH = "index.html"

// Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    style.title.width = style.base.width = "100%";
    style.deleteIcon = {
        marginLeft: "2px",
        marginTop: "2px",
        float: "right"
    }

    return (
        <div style={style.base}>
            <div style={style.title} >
                <span onClick={node.onOpen}>
                    <i className={iconClass} style={iconStyle}/>
                    {node.name}
                </span>
                <i onClick={node.onDelete} className="fa fa-trash" style={style.deleteIcon}/>
            </div>
        </div>
    );
};

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            page: window._pageData,
            filepath: DEFAULT_FILEPATH,
            file_content: "",
            reloading_preview: true,
            preview_filepath: "index.html"
        };

       this.reloadFileTree()

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

        // Save every 10 seconds
        
    }

    maybeTriggerSave () {
        clearTimeout(this.saveTimeout)
        this.saveTimeout = setTimeout(() => this._saveFile(), 3 * 1000)
    }

    reloadFileTree () {
        return BloggifyActions.post("projects.listFiles", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
        }).then(files => {
            this.setState({ files });
        });
    }

    deleteFile (path) {
        BloggifyActions.post("projects.deleteFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: path
        }).then(() => {
            return this.reloadFileTree()
        }).then(() => {
            if (this.state.filepath === path) {
                return this.openFile(DEFAULT_FILEPATH);
            }
        }).catch(err => {
            alert(err.message);
        });
    }

    openFile (path) {
        this.editor_content = ""
        const prom = BloggifyActions.post("projects.getFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: path
        }).then(data => {
            this.setState({
                file_content: data.Body,
                filepath: path
            });
        });
        prom.catch(err => {
            alert(err.message);
        });
        return prom
    }

    _saveFile (opts = {}) {
        return BloggifyActions.post("projects.saveFile", {
            project_name: this.state.page.project.name,
            username: this.state.page.project.username,
            filepath: opts.filepath || this.state.filepath,
            content: this.editor_content
        })
    }

    saveFile (opts = {}) {
        this.setState({
            reloading_preview: true
        })
        const prom = this._saveFile(opts).then(() => {
            this.reloadPreview()
        })
        prom.catch(err => {
            alert(err.message);
        });
        return prom
    }

    newFile () {
        const filepath = prompt("New file name:");
        this.editor_content = "";
        this.saveFile({
            filepath
        }).then(() => {
            return this.reloadFileTree()
        }).then(() => {
            return this.openFile(filepath)
        })
    }

    commitProject () {
        const commit_message = prompt("Commit message");
        if (!commit_message) {
            return
        }
        BloggifyActions.post("projects.commit", {
            project_name: this.state.page.project.name,
            commit_message
        }).catch(err => alert(err.message))
    }

    onEditorContentChange (content) {
        this.editor_content = content;
        this.maybeTriggerSave()
    }

    renderFolderTree () {
        if (this.state.files) {
            const walk = obj => {
                obj.active = false;
                obj._path = obj.path.split("/").slice(2).join("/");
                obj.onOpen = () => {
                    this.openFile(obj._path)
                }
                obj.onDelete = () => {
                    if (confirm(`Do you really want to delete ${obj._path}?`)) {
                        this.deleteFile(obj._path)
                    }
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
                            <button className="btn btn-small" onClick={this.saveFile.bind(this)}>Save (⌘ + S)</button>
                            <button className="btn btn-small" onClick={this.commitProject.bind(this)}>Commit</button>
                            <button className="btn btn-small" onClick={this.newFile.bind(this)}>New file</button>
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
                                        <a href={previewFileUrl} target="blank">Open in New Tab</a> |
                                        <span className="pull-right breadcrumbs">
                                            <a href={`/users/${_pageData.project.username}`}>
                                                @{_pageData.project.username}   
                                            </a>
                                            /
                                            <a href={`/users/${_pageData.project.username}/projects`}>
                                                projects 
                                            </a>
                                            /
                                            <a href={`/users/${_pageData.project.username}/projects/${_pageData.project.name}`}>
                                                {_pageData.project.name}
                                            </a>
                                            /edit
                                        </span>
                                        
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
