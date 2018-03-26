import React from "react"
import List from "./list"
import Calendar from 'react-github-contribution-calendar';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData.user
          , hackers:  window._pageData.hackers
        }
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
                <List hackers={hackers} user={this.state.user} />
            </div>
        )
    }
}
