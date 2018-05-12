// Dependencies
import React from 'react';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    console.log(props)
    this.state = {
      currentUser: window._pageData.user
    }
  }
  render(){
    return(
    	<h1></h1>
    )
  }
}