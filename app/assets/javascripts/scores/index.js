import React from "react"
import List from "./list"
import CalendarHeatmap from 'react-calendar-heatmap';
import Actions from "bloggify/actions"
import $ from 'jquery'

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentUser: window._pageData.user
          , hackers:  window._pageData.hackers
        }

        //Getting current user data

        this.generalData
        this.currentPhase = 1;
        /*
          current mode:
          0 = general score
          1 = personal score
        */
        this.currentMode = 1;
        this.dimentionNames = ["Technology", "Functionality", "InfoVis", "Novelty"]
        this.dimentionDescription = ["Tech requirements: You are expected to meet all 10 technological requirements specified in the challenge description (www.ironhacks.com/task). All requirements are equally weighted. The more more requirements you meet the better", "Error rating: We evaluate the quality of your code by counting the errors and diving it by the total number of lines of code. The lower the value the better your code.", "System affordance: Does the application offer recognizable elements and interactions that can be understood by the user? ", "Adding new data sets definitely makes your app stand (take out the three letters) out from the rest. We evaluate how successfully you implement additional open datasets: How relevant are they for you're the application? How novel is the visualization of this data? We evaluate each dataset individually and average it across all datasets."]
        this.measureTypeDescription = ["Error rating", "Number of technology", "Number of user requirements met", "Usability point achieved"]



        //this.pullPersonalScore()
        //this.showGeneralScore()
    }
    /*
    populate(){
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 1,
            hack_id: 1,
            user_id: "aldiazve",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase1/preview/index.html",
            hacker_id : 1
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 2,
            hack_id: 1,
            user_id: "aldiazve",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase2/preview/index.html",
            hacker_id : 1
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 3,
            hack_id: 1,
            user_id: "aldiazve",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase3/preview/index.html",
            hacker_id : 1
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 4,
            hack_id: 1,
            user_id: "aldiazve",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase4/preview/index.html",
            hacker_id : 1
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 5,
            hack_id: 1,
            user_id: "aldiazve",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase5/preview/index.html",
            hacker_id : 1
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 1,
            hack_id: 1,
            user_id: "RCODI",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase1/preview/index.html",
            hacker_id : 2
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 2,
            hack_id: 1,
            user_id: "RCODI",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase2/preview/index.html",
            hacker_id : 2
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 3,
            hack_id: 1,
            user_id: "RCODI",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase3/preview/index.html",
            hacker_id : 2
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 4,
            hack_id: 1,
            user_id: "RCODI",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase4/preview/index.html",
            hacker_id : 2
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 5,
            hack_id: 1,
            user_id: "RCODI",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase5/preview/index.html",
            hacker_id : 2
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 1,
            hack_id: 1,
            user_id: "jealdana",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase1/preview/index.html",
            hacker_id : 3
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 2,
            hack_id: 1,
            user_id: "jealdana",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase2/preview/index.html",
            hacker_id : 3
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 3,
            hack_id: 1,
            user_id: "jealdana",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase3/preview/index.html",
            hacker_id : 3
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 4,
            hack_id: 1,
            user_id: "jealdana",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase4/preview/index.html",
            hacker_id : 3
          });
          Actions.post("generalop.insert", {
            semester: "spring_2018",
            group_id: "bogota",
            phase_id: 5,
            hack_id: 1,
            user_id: "jealdana",
            project: "http://www.ironhacks.com/users/aldiazve/projects/webapp_phase5/preview/index.html",
            hacker_id : 3
          });
    }
    */
    pullPersonalScore(){
      Actions.get("scores.getPersonalScores")
          .then(scores => {
              console.log(scores)
          })
    }
    //select the color ranges 
    githubClassForValue(value) {
      if (!value) {
        return 'color-empty';
      }
      if(value.count < 10){
        return `color-github-1`; 
      } else if(value.count < 20){
        return `color-github-2`;
      } else if(value.count < 30){
        return `color-github-3`;
      } else if(value.count < 60){
        return `color-github-4`;
      }
    }

    render () {
        const hackers = this.state.hackers.filter(c => {
            return c.score_total || c.github_repo_url || c.project_url
        })
        //Putting the data in the correct format
        const calendarKeys = Object.keys(_pageData.calendar_values)
        var values = []
        for (var i = 0; i < calendarKeys.length; i++) {
          values.push({date: calendarKeys[i], count: _pageData.calendar_values[calendarKeys[i]]})
        }
        return (
            <div className="page-content">
                <CalendarHeatmap
                  startDate={new Date('2018-03-01')}
                  endDate={new Date('2018-05-31')}
                  classForValue={this.githubClassForValue}
                  values={values}
                />
            </div>
        )
    }
}
