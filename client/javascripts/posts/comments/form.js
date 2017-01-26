import React from "react";
import CsrfInput from "../../util/csrf-input";
import Editor from "react-md-editor";

export default class CommentForm extends React.Component {
    render () {
        return (
            <form className="create-todo-form" method="post" action={`${this.props.topic.url}/comments`}>
                <CsrfInput />
                <textarea ref="commentBody" name="body" hidden></textarea>
                <Editor onChange={this.updateCommentBody.bind(this)} />
                <button>Post</button>
            </form>
        );
    }
    updateCommentBody (comment) {
        this.refs.commentBody.value = comment;
    }
}
