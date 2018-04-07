import React from "react"
import brace from "brace"
import AceEditor from "react-ace";
import BloggifyActions from "bloggify/actions"
import FolderTree from "react-folder-tree"
import {Treebeard, decorators} from "react-treebeard"
import Actions from "bloggify/actions"
import SweetAlert from "sweetalert2-react"
import swal from 'sweetalert';
import { renderToStaticMarkup } from 'react-dom/server';

import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/theme/monokai'

import 'brace/ext/searchbox'

const DEFAULT_FILEPATH = "index.html"

decorators.Header = ({style, node}) => {
		const isFolder = node.children
				, iconType = isFolder ? 'folder' : 'file-text'
				, iconClass = `fa fa-${iconType}`
				, iconStyle = {marginRight: '5px'}

		style.title.width = style.base.width = "100%";
		style.deleteIcon = {
				marginLeft: "2px",
				marginTop: "2px",
				float: "right"
		}

		if (isFolder) {
				node.onDelete = null
				node.onOpen = null
		}

		const deleteIcon = node.onDelete && <i onClick={node.onDelete} className="fa fa-trash" style={style.deleteIcon}/>

		return (
				<div style={style.base} data-type={iconType}>
						<div style={style.title} >
								<span onClick={node.onOpen}>
										<i className={iconClass} style={iconStyle}/>
										{node.name}
								</span>
								{deleteIcon}
						</div>
				</div>
		);
};

export default class App extends React.Component {
		constructor (props) {
				super(props);
				window.addEventListener("beforeunload", e => {
						if (!this.saved) {
								event.returnValue = "You may lose changes..."
						}
				})
				this.state = {
						page: window._pageData,
						filepath: DEFAULT_FILEPATH,
						file_content: "",
						reloading_preview: true,
						preview_filepath: "index.html",
						readonly: !!_pageData.query.readonly,
				}
				this.saved = true
				this.reloadFileTree()

				this.editor_content = "";
				this.openFile(this.state.filepath);

				window.addEventListener("keydown", event => {
						if (event.ctrlKey || event.metaKey) {
								switch (String.fromCharCode(event.which).toLowerCase()) {
										case "s":
												event.preventDefault();
												this.saveFile()
												break;
								}
						}
				})

				
				//ADV
				this.getURLParameter("dfs")
				this.isLastCommit = false

				//ADV
		}

		//ADV
		getURLParameter(parameter){
			let params = new URLSearchParams(document.location.search.substring(1));
			let status = params.get(parameter);
				console.log(status)
			if(status){
				this.qualtricsHandler(status)
				params.delete(parameter)
			}
		}
		//ADV

		_getEditorMode (filepath) {
				const extension = filepath.split(".").slice(-1)[0]
				const mappings = {
						js: "javascript"
				}
				const editorMode = mappings[extension] || extension
				return editorMode
		}

		maybeTriggerSave () {
				clearTimeout(this.saveTimeout)
				this.saveTimeout = setTimeout(() => this._saveFile(), 3 * 1000)
		}

		reloadFileTree () {
				return BloggifyActions.post("projects.listFiles", {
						project_name: this.state.page.project.name,
						username: _pageData.project.username
				}).then(files => {
						this.setState({ files });
				});
		}

		deleteFile (path) {
				BloggifyActions.post("projects.deleteFile", {
						project_name: this.state.page.project.name,
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
				if (this.maybeNotSaved()) { return }
				if (this.state.readonly) {
						Actions.post("stats.insert", {
								event: `open-file`,
								metadata: {
										url: location.href,
										file_path: path
								}
						});
				}

				this.editor_content = ""
				const prom = BloggifyActions.post("projects.getFile", {
						project_name: this.state.page.project.name,
						filepath: path,
						username: _pageData.project.username
				}).then(data => {
						this.editor_content = data.Body
						this.setState({
								file_content: data.Body,
								filepath: path
						})
				})

				prom.catch(err => {
						alert(err.message)
				})

				return prom
		}

		_saveFile (opts = {}) {
				if (this.saved) {
						return Promise.resolve()
				}
				if (this.state.readonly) {
						return Promise.reject(new Error("You are in the read-only mode. Cannot save the file."));
				}

				Actions.post("stats.insert", {
						event: "save-file",
						metadata: {
								project_name: this.state.page.project.name,
								filepath: opts.filepath || this.state.filepath,
						}
				});

				return BloggifyActions.post("projects.saveFile", {
						project_name: this.state.page.project.name,
						filepath: opts.filepath || this.state.filepath,
						content: this.editor_content,
						safe: opts.safe
				}).then(() => {
						this.saved = true
				})
		}

		saveFile (opts = {}) {
				this.setState({
						reloading_preview: true
					, file_content:this.editor_content
				})
				const prom = this._saveFile(opts).then(() => {
						this.reloadPreview()
				})
				prom.catch(err => {
						alert(err.message);
				});
				return prom
		}

		maybeNotSaved () {
				if (!this.saved) {
						alert("Please save your changes first.")
						return true
				}
		}

		newFile () {
				if (this.maybeNotSaved()) { return }
				const filepath = prompt("Enter the new file name. You can use slashes for creating files in directories.");
				if (!filepath) {
						return
				}
				this.saved = false
				this.editor_content = "";
				this.saveFile({
						filepath,
						safe: true
				}).then(() => {
						return this.reloadFileTree()
				}).then(() => {
						return this.openFile(filepath)
				})
		}

		commitFile (commit_message) {
				BloggifyActions.post("projects.commit", {
						project_name: this.state.page.project.name,
						commit_message
				}).catch(err => alert(err.message))
		}

		commitProject () {
				/*
				if (this.maybeNotSaved()) { return }
				this.setState({ show_commit_prompt: true })
		*/
		//ADV
		//Content objects:
			const preAlertContent = {
				title: "Commit",
				text: "Is this your last commit for this phase?",
				buttons: {
			    cancel: {
				    text: "Cancel",
				    visible: true,
				  },
			    noFinalCommit : {
			    	text: "No",
			    	visible: true,
			    	value: 'noFinalCommit',
			    },
			    confirm: "Yes",
				}
			}
			const surveyRedirecAlert = {
				title: "Final commit",
				text: "Before push your final commit, you must fill the phase survey.",
			  buttons: {
			    cancel: true,
			    confirm: "Go to survey",
				}
		  }
			const commitContent = {
				title: "Commit",
				text: "Please add a message to your commit:",
				content: {
			    element: "input",
			    attributes: {
			      placeholder: "Commit description",
			      type: "text",
			    }
			  },
			  buttons: {
			    cancel: true,
			    confirm: "Confirm",
				}
		  }	
		  const successCommit = {
				title: "Success!",
				icon: "success",
				text: "Keep working hard!",
			  buttons: {
			    confirm: "OK",
				}
		  }	
		
			swal(preAlertContent).then((finalCommit) => {
				//Normal commit
							console.log(location)
						console.log(finalCommit)
				if (finalCommit == "noFinalCommit") {
					swal(commitContent).then((result) => {
						if(result){
							swal(successCommit)
						}
					})
				}else if(finalCommit){ //Last commit
					swal(surveyRedirecAlert).then((result) => { 
						if(result){
							var currentLocation = location.href
							var clearURL = this.removeURLParameter(currentLocation, "dfs");
							document.location.href='https://purdue.ca1.qualtrics.com/jfe/form/SV_41l8wPCDUpOIvBj?redirect_to=' + clearURL;
						}
					})
				}else { 
					//User hit cancel.
				}
			})

			//ADV
		}
		//ADV

		//This function continues with the commit process after the survey.
		qualtricsHandler(didFinishSurvey){
			const commitContent = {
				title: "Commit",
				text: "Please add a message to your commit:",
				content: {
			    element: "input",
			    attributes: {
			      placeholder: "Commit description",
			      type: "text",
			    }
			  },
			  buttons: {
			    cancel: true,
			    confirm: "Confirm",
				}
			}
			const successCommit = {
				title: "Success!",
				icon: "success",
				text: "Keep working hard!",
			  buttons: {
			    confirm: "OK",
				}
		  }
			if(didFinishSurvey == 1){
				swal(commitContent).then((result) => { 
						if(result){
							 swal(successCommit)
						}
					})
			}
		}
		//We use this to clear the url before go to qualtrycs.
		removeURLParameter(url, parameter) {
	    //prefer to use l.search if you have a location/link object
	    var urlparts= url.split('?');   
	    if (urlparts.length>=2) {

	        var prefix= encodeURIComponent(parameter)+'=';
	        var pars= urlparts[1].split(/[&;]/g);

	        //reverse iteration as may be destructive
	        for (var i= pars.length; i-- > 0;) {    
	            //idiom for string.startsWith
	            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
	                pars.splice(i, 1);
	            }
	        }

	        url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
	        return url;
	    } else {
	        return url;
	    }
		}
		//ADV


		onEditorContentChange (content) {
				this.editor_content = content;
				this.maybeTriggerSave()
				this.saved = false
		}

		renderFolderTree () {
				if (this.state.files) {
						const walk = obj => {
								obj.active = false;
								obj._path = obj.path.split("/").slice(2).join("/");
								if (obj.clickable !== false) {
										obj.onOpen = () => {
												this.openFile(obj._path)
										}
								}
								if (obj.deletable !== false) {
										obj.onDelete = () => {
												if (confirm(`Do you really want to delete ${obj._path}?`)) {
														this.deleteFile(obj._path)

												}
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
						this.state.files.deletable = false;
						this.state.files.clickable = false;
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

		renderSurveys () {
				const afterHackSurvey = `https://purdue.qualtrics.com/jfe/form/SV_bKmRJnCYfb9rRnn?redirect_to=${location.href}`;
				return <div>
						If this is your last commit for this phase, please provide the mandatory submission information <a href={afterHackSurvey} target="blank">here</a>!
				</div>
		}
		renderLeftBoottomControls () {
				return <div className="left-bottom-controls">
				</div>
		}

		render () {
				const previewFileUrl = `/users/${_pageData.project.username}/projects/${_pageData.project.name}/preview/${this.state.preview_filepath}`
				const commitPromptHtml = <div>
						<p>Enter the commit message below:</p>
						<p><input autoFocus="autofocus" id="commit-message" type="text" className="swal2-input" /></p>
						{this.renderSurveys()}
				</div>
				return (
						<div>
								<div className="row editor-container">
										<div className="readonly-badge">
												Read-only
										</div>
										<div className="col file-tree-column">
												<div className="editor-controls">
														<button className="btn btn-small" onClick={this.saveFile.bind(this)}>Save (⌘ + S)</button>
														<button className="btn btn-small" onClick={this.commitProject.bind(this)}>Commit</button>
														<button className="btn btn-small" onClick={this.newFile.bind(this)}>New file</button>
												</div>
												{this.renderFolderTree()}
												{this.renderLeftBoottomControls()}
										</div>
										<div className="col">
												<div className="row">
														<div className="col editor-column">
																<AceEditor
																		mode={this._getEditorMode(this.state.filepath)}
																		theme="monokai"
																		value={this.editor_content || this.state.file_content}
																		onChange={this.onEditorContentChange.bind(this)}
																		name="project-ace-editor"
																		width="100%"
																		height="100%"
																		editorProps={{
																				$blockScrolling: true
																		}}
																		readOnly={this.state.readonly}
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
				)
		}
}
