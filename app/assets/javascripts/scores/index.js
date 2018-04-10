import React from "react"
import List from "./list"
import Calendar from 'react-github-contribution-calendar'
import $ from 'jquery'

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData.user
          , hackers:  window._pageData.hackers
        }
        this.googleDocs = "https://sheets.googleapis.com/v4/spreadsheets/1xyAIRzFqiHpiZGtAI7QHR5DaycFupuQERc41y8Fu-eo/values/Sheet1!A1%3AM31?key=AIzaSyDzZog6BPwu__S1klBvsGwrtLME6U0oP7s"
        this.getDataFromGoogle()
    }

    getDataFromGoogle(){
      var self = this
      self.state.gData = $.get(self.googleDocs, () => {
        
      })
        .done(function () {
          console.log(self.state.gData.responseJSON)
          
        })
        .fail(function (error) {
          //fail
          console.error(error);
        })
    }

    render () {
        const hackers = this.state.hackers.filter(c => {
            return c.score_total || c.github_repo_url || c.project_url
        })
        const values = _pageData.calendar_values
        const until = new Date() //'2016-06-30';
          var panelColors = [
              '#EEEEEE',
              '#F78A23',
              '#F87D09',
              '#AC5808',
              '#7B3F06'
          ];
        return (
            <div className="page-content">
                <Calendar values={values} until={until} panelColors={panelColors} />
            </div>
        )
    }
}
