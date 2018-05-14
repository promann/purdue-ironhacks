// Dependencies
import React from 'react';
import Actions from 'bloggify/actions';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    let params = new URLSearchParams(document.location.search.substring(1));
    let owner = params.get('x');
    this.state = {
      currentUser: window._pageData.user,
      owner: owner,
      libs: []
    }

    //Biding 
    this.pullUsedLibraries = this.pullUsedLibraries.bind(this)
    this.pullUsedLibraries()
  }
  render(){
    if(this.state.score){
      this.state.libs = this.state.score.white_list.map((link) => {
        return(
          <tr key={link.toString()}>
            <td>{link}</td>
          </tr>
        )
      })
    }
    return(
    	<div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <p><strong>Welcome IronHacker!</strong></p>
            <p>Here you will find the libraries used by <strong>{this.state.owner}</strong> during <strong>phase {this.state.score ? this.state.score.phase: " "}</strong></p>
            <p>You are allowed to reuse this libraries on your app. Indeed, we actually encourage you to do so. All these libraries are within the official list (link of official libraries), so don't be afraid to use them to improve your app.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table>
              <thead>
                <tr>
                  <th style={{"color": "white"}}>Libraries used by {this.state.owner}</th>
                </tr>
              </thead>
              <tbody>
                {this.state.libs}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  pullUsedLibraries(){

    Actions.get("scores.getUsedLibraries")
      .then(scores => {
        console.log(score)
          this.state.libLinks = scores
          for (var i = 0; i < scores.length; i++) {
            if(scores[i].owner_username == this.state.owner){
              this.setState({"score": scores[i]})
            }
          }
          
      })
  }
}