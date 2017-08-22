import React from "react";

export default class Preview extends React.Component {

	constructor () {
		super()
		this.state = {
			filepath: "index.html"
		}
	}

	reload () {
		const iframe = this.refs.display
		iframe.src = iframe.src
	}

    render () {
	const previewFileUrl = `/users/${_pageData.project.username}/projects/${_pageData.project.name}/preview/${this.state.filepath}`
        return (
            <div className="editor-preview">
		<div className="open-in-new-tab">
			<a href={previewFileUrl} target="blank">Open in New Tab</a>
		</div>
		<iframe src={previewFileUrl} ref="display" className="editor-preview-iframe" />
            </div>
        );
    }
}
