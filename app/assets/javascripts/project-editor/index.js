import React from "react"
import brace from "brace"
import AceEditor from "react-ace";
import BloggifyActions from "bloggify/actions"
import FolderTree from "react-folder-tree"
import {Treebeard, decorators} from "react-treebeard"
import Actions from "bloggify/actions"
import swal from 'sweetalert2';
import { renderToStaticMarkup } from 'react-dom/server';
import $ from "jquery"

import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/mode/css'
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

//ADV
const CUPL_HACK_TYPE  = "CUPL_spring_2018"
//ADV

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
      showPrev: true,
      wrongTreatment: false,
      user: window._pageData.user
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
    if(this.state.user.profile.hack_type == CUPL_HACK_TYPE){
      this.commitSurveyLinks = {
        phase1: "https://purdue.ca1.qualtrics.com/jfe/form/SV_cUgJ1RrGquz3GcZ",
        phase2: "https://purdue.ca1.qualtrics.com/jfe/form/SV_6mUpUncphCN30zP",
        phase3: "https://purdue.ca1.qualtrics.com/jfe/form/SV_3PHEFpceJxjXmIJ",
        phase4: "https://purdue.ca1.qualtrics.com/jfe/form/SV_38ANqQOfuCI3CSx",
        phase5: "https://purdue.ca1.qualtrics.com/jfe/form/SV_8xhtVYP2Ah1mRHT",
      }
    }else{
      this.commitSurveyLinks = {
        phase1: "https://purdue.ca1.qualtrics.com/jfe/form/SV_6lCUlDlDWN1FbbD",
        phase2: "https://purdue.ca1.qualtrics.com/jfe/form/SV_54rzA3pmM7ojfTf",
        phase3: "https://purdue.ca1.qualtrics.com/jfe/form/SV_5BDyrHjKSiYI3sN",
        phase4: "https://purdue.ca1.qualtrics.com/jfe/form/SV_8vJ87qGAiE7EL1b",
        phase5: "https://purdue.ca1.qualtrics.com/jfe/form/SV_4JybKpVu3Cn6ODH",
      }
    }
    //Setting the "read-only state"
    if(this.state.page.project.username != this.state.user.username){
      // The current user is NOT the owner of the project, now we need to check the treatment, if the hack_id == 0 the user shouldn't be here (treatment 1)
      // Checking if the current user is admin
      if(window._pageData.isAdmin){
        //This is an admin, showing everithing
      }else{
        //Pulling data from the current user:
        Actions.get("getuser.getUser")
          .then(function(user){
            if(this.state.user.profile.hack_id != user[0].profile.hack_id){
              //This user should be here
              this.state.wrongTreatment = true
            }else{
              if(this.state.user.profile.hack_id == 0){
                //This user should be here
                this.state.wrongTreatment = true
              }else if(this.state.user.profile.hack_id == 1){
                this.state.showPrev = false
              }
            }
            if(this.state.page.project.phase[5] >= 3){            
              this.state.wrongTreatment = true
            }
          }.bind(this))
      }
      this.state.readonly = true

    }

    if(this.state.readonly){
      //Overrating decorators.header to hide delete icon
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
        return (
          <div style={style.base} data-type={iconType}>
            <div style={style.title} >
              <span onClick={node.onOpen}>
                <i className={iconClass} style={iconStyle}/>
                {node.name}
              </span>
            </div>
          </div>
        );
      };
    }
    //ADV

    this.mouseSet = []
    this.shouldTrackMouse = true
    //Adding listener
    $("body").mousemove(function(e) {
      if(this.shouldTrackMouse){
        this.mouseSet.push({'x' : e.pageX, 'y': e.pageY})
        if(this.mouseSet.length > 1000){
          this.mouseSet = []
        
        }
        this.shouldTrackMouse = false
      }else{
        this.shouldTrackMouse = true
      }
    }.bind(this))
  }
  //ADV
  getURLParameter(parameter){
      let params = new URLSearchParams(document.location.search.substring(1));
      let status = params.get(parameter);
      if(status){
          this.qualtricsHandler(status)
          params.delete(parameter)
      }
  }
  //ADV

  _getEditorMode (filepath) {
          const extension = filepath.split(".").slice(-1)[0]
          const mappings = {
                  js: "javascript",
                  html: "html",
                  css: "css"
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
      this.saved = false
      this.state.readonly = false
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
          return BloggifyActions.post("projects.commit", {
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
        text: "Do you want to submit this version for grading for phase " + this.state.page.project.phase[5] + "?",
        confirmButtonText: 'Yes',
        confirmButtonColor: '#F39D26',
        showCancelButton: true,
        cancelButtonColor: '#F39D26',
        cancelButtonText: 'No',
        showCloseButton: true,
        allowOutsideClick: false
    }
    const surveyRedirecAlert = {
      title: "Final commit",
      text: "Before push your final commit for this phase, you must fill the phase survey.",
      confirmButtonText: 'Go to survey',
      confirmButtonColor: '#F39D26',
      showCancelButton: true,
      cancelButtonColor: '#F39D26',
      cancelButtonText: 'Cancel',
      showCloseButton: true,
      allowOutsideClick: false
    }
    const finalCommitNotAble = {
      type: 'warning',
      html: "Dear Participant, The final commit for " + this.state.page.project.phase[5] + " will be available on <strong>May 14 12:00 EST </strong>.",
      confirmButtonText: 'OK',
      confirmButtonColor: '#F39D26',
      allowOutsideClick: false,
      animation: false
    }
    const commitContent = {
      title: "Commit",
      text: "Enter the commit message below:",
      confirmButtonText: 'Send',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
      input: 'text',
      inputPlaceholder: 'Commit message',
      inputValidator: (value) => {
        return !value && 'You need to write a commit message!'
      }
    } 
    const successNoFinalCommit = {
      title: "Success",
      type: "success",
      text: 'You have just commited your code to github! Congratulations!\nRemember: To submit your app for grading you have to make a final commit (select yes)',
      confirmButtonText: 'OK',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
    }
    const commitCanceled = {
      title: "Error",
      type: "error",
      text: "Your commit was canceled.",
      confirmButtonText: 'OK',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
    }

    const currentLocation = location.href
    const currentPhase = this.state.page.project.phase 
    const clearURL = this.removeURLParameter(currentLocation, "dfs")
    
    const loading = {
      html: "<div class='loader-container'><div class='loader'></div><h2 class='loader-title'>Redirecting...</h2><br><p>Click <a href=" + this.commitSurveyLinks[currentPhase] + '?redirect_to=' + clearURL + ">here</a> if you are not redirected in less than 5 seconds</p></div>",
      showConfirmButton: false,
      showCloseButton: false,
      allowOutsideClick: false,
    }
  
    swal(preAlertContent).then((result) => {
        //Normal commit
        if (result.dismiss === swal.DismissReason.esc || result.dismiss === swal.DismissReason.close) {
          //User hit scape or close
        }else if (result.dismiss === swal.DismissReason.cancel) {
          //The user hit "No", so this is not a final commit
          swal(commitContent).then((result) => {
            if (result.dismiss === swal.DismissReason.esc || result.dismiss === swal.DismissReason.close) {
              //The user hit esc or cancel
              swal(commitCanceled)
            }else if (result){
              this.commitFile(result)
              Actions.post("stats.insert", {
                event: "no-final-commit",
                metadata: {
                  project_name: this.state.page.project.name,
                  phase_id: this.state.page.project.phase,
                  user_email: this.state.user.email,
                  github_username: this.state.user.profile.github_username,
                  hack_id : this.state.user.profile.hack_id                  
                }
              });
              swal(successNoFinalCommit)
            }
          })
        }else if (result.value == true) {
          //Here we make the "precommit"
          if(new Date() > new Date(2018, 4, 18, 0, 0, 0)){
            this.commitFile("Automatic commit. Done before go to queltrics")
              Actions.post("stats.insert", {
                event: "automatic-commit",
                metadata: {
                  project_name: this.state.page.project.name,
                  phase_id: this.state.page.project.phase,
                  user_email: this.state.user.email,
                  github_username: this.state.user.profile.github_username,
                  hack_id : this.state.user.profile.hack_id                  
                }
              });
              swal(surveyRedirecAlert).then((result) => { 
                if (result.dismiss === swal.DismissReason.esc || result.dismiss === swal.DismissReason.close || result.dismiss === swal.DismissReason.cancel) {
                  //User hit scape or close
                  return false
                }else if (result.value == true){
                  swal(loading)
                  return this
                }                
              }).then(x => new Promise(resolve => setTimeout(() => resolve(x), 2000)))
                .then((x) => {
                  if(x){
                    document.location.href= this.commitSurveyLinks[currentPhase] + '?redirect_to=' + clearURL;
                  }
              })
          }else{
            swal(finalCommitNotAble)
          }
        }
    })
  //ADV
  }
  //ADV

  //This function continues with the commit process after the survey.
  qualtricsHandler(didFinishSurvey){
    const commitContent = {
      title: "Commit",
      text: "Enter the commit message below:",
      confirmButtonText: 'Send',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
      input: 'text',
      inputPlaceholder: 'Commit message',
      inputValidator: (value) => {
        return !value && 'You need to write a commit message!'
      }
   } 
    const successFinalCommit = {
      title: "Success",
      type: "success",
      text: 'Thanks for making your final commit for phase ' + this.state.page.project.phase[5] + '! Your app will be considered for evaluation! Stay tuned and wait for feedback in your dashboard!' ,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
    }
    const commitCanceled = {
      title: "Error",
      type: "error",
      text: "Your commit was canceled.",
      confirmButtonText: 'Ok',
      confirmButtonColor: '#F39D26',
      showCloseButton: true,
      allowOutsideClick: false,
    }

    if(didFinishSurvey == 1){
      //Pushing to the database
      Actions.post("surveytracker.insert", {
        hack_type: this.state.user.profile.hack_type,
        user_email: this.state.user.email,
        github_username: this.state.user.profile.github_username,
        phase: this.state.page.project.phase[5],
        status: 'true',
      });
      //showing alert
      swal(commitContent).then((result) => {
        if (result.dismiss === swal.DismissReason.esc || result.dismiss === swal.DismissReason.close) {
          //The user hit esc or cancel
          swal(commitCanceled)
        }else if(result){
          this.commitFile(result)
          Actions.post("stats.insert", {
            event: "final-commit",
            metadata: {
              project_name: this.state.page.project.name,
              phase_id: this.state.page.project.phase,
              user_email: this.state.user.email,
              github_username: this.state.user.profile.github_username,
              hack_id : this.state.user.profile.hack_id                  
            }
          })
          swal(successFinalCommit)
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
    if(this.state.wrongTreatment && !(this.state.user.role == "admin")){
      return (
        <h1>YOU SHOULDN'T BE HERE. PLEASE BE HONEST.</h1>
      )
    }
    var previewFileUrl = ""
    if(typeof _pageData.project.id == "undefined"){
      previewFileUrl = `/users/${this.state.user.username}/projects${_pageData.project.name}/preview/${this.state.preview_filepath}`
    }else{
      previewFileUrl = `/users/${_pageData.project.id}/projects/${_pageData.project.name}/preview/${this.state.preview_filepath}`
    }
    //ADV
    //Loading the buttons only if the user has pemitions
    var controlButtons = ( <div></div> )
    if(!this.state.readonly){
      controlButtons = (
        <div className="editor-controls">
          <button className="btn btn-small"
            onClick={this.saveFile.bind(this)}
            style={{'display': this.state.readonly ? 'none' : 'inline-block'}}
          >Save and run (⌘ + S)</button>
          <button className="btn btn-small"
            onClick={this.commitProject.bind(this)}
            style={{'display': this.state.readonly ? 'none' : 'inline-block'}}
          >Commit</button>
          <button className="btn btn-small"
            onClick={this.newFile.bind(this)}
            style={{'display': this.state.readonly ? 'none' : 'inline-block'}}
          >New file</button>
        </div>
      )
    }
    //Loading the preview object only if the user has pemitions
    var preview = ( <div></div> )
    if(this.state.showPrev){
      preview = (
        <div className="col preview-column">
          <div className={`editor-preview ${this.state.reloading_preview ? "reloading-preview" : "loaded-preview"}`}>
            <div className="open-in-new-tab">
              <a href={previewFileUrl} target="blank">Open in New Tab</a> |
            </div>
            <iframe src={previewFileUrl} id="preview-iframe" className="editor-preview-iframe" onLoad={this.previewLoaded.bind(this)} />
            <div className="iframe-spinner">
              Loading...
            </div>
          </div>
        </div>
      )
      
    }
    //ADV
    return (
      <div> 
        <div className="row editor-container">
          <div className="readonly-badge">
            Read-only
          </div>
          <div className="col file-tree-column">
            {controlButtons}
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
                  showPrintMargin={false}
                  wrapEnabled={true}
                  enableBasicAutocompletion={true}
                  enableLiveAutocompletion={true}
                  readOnly={this.state.readonly}
                />
              </div>
              {preview}
            </div>
          </div>
        </div>
      </div>
        )
  }
}
