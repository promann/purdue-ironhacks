import React from "react"

export default class ViewProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {}

    }

    _setActiveUrl (active_url) {
    	this.setState({
        	active_url
        })
    }


    showCode () {
        this._setActiveUrl(_pageData.code_url)
    }

	showApp () {
        this._setActiveUrl(_pageData.view_url)
    }

    render () {
        return (
            <div>
            	<div className="view-project-header">
	            	<h1>View Project</h1>
	            	<button className="btn btn-small" onClick={this.showCode.bind(this)}>Show Code</button>
	                <button className="btn btn-small" onClick={this.showApp.bind(this)}>Show App</button>
                </div>
                <iframe src={this.state.active_url} id="view-project-iframe"/>
			</div>           	
        )
    }
}
