import React from 'react';
import Actions from 'bloggify/actions';

// Constants
const VIEW_INDIVIDUAL = 'FEEDBACK';
const VIEW_COMPETITORS = 'COMPETITORS';
const TITLE = {
  FEEDBACK : "INDIVIDUAL FEEDBACK",
  COMPETITORS : "GENERAL SCORE"
}
const TABLES_NAMES = ["Technology", "Analytics", "Visualization"]
const TABLE_DESCRIPTIONS = [
  'Below, you find the performance of the software code of your app! As a programmer it is important to write flawless code! Also keep in mind that a programmer has to comply to the technological requirements! Check out how well you do!',
  'Below, you can find out how well you master the analytical expectations of the app user! Remember, the wanted to find the optimal solution! How close did you get in mastering the analytical challenges? Check out below',
  'Below, you can find out tackle the visualization of the data and analytics in your app. Remember, that there very creative ways to visualize metrics. Check out below how your app tackles the visualization task, and how advanced you are in visualization data. Our goal is to turn you into a visualization champion!'  
]
const DIMENSION_NAMES = {
  Technology: ['Error rating', 'Number of technology requirements met'],
  Analytics: ['Quality of rankings', 'Functionality', 'Variable variety'],
  Visualization: ['Map requirements', 'Chart variety', 'Usability points achieved', 'Novelty of the mandatory parameters on the map', 'Novelty of the additional data sets on the map', 'Novelty of the mandatory parameters on the charts', 'Novelty of the additional data sets on the charts']
}
const DIMENSION_DESCRIPTIONS = {
  Technology: [
    'We evaluate the quality of your code by counting the errors and dividing it by the total number of lines of code. The lower the value, the better your code.',
    ' You are expected to meet all 10 technological requirements specified in the challenge description (www.ironhacks.com/task). All requirements are equally weighted. The more requirements you meet, the better.'],
  Analytics: [
    'As specified in the task (www.ironhacks.com/task), you were asked to correctly rank the districts with respect to three parameters (distance, safety, afforability); this measures accounts whether you correctly find the 10 best districts for each variable individually  and all jointly (ranking considering all three variables jointly). The value describes how many correct ranks you have idenified for all 4 ranking dimensions. ',
    "Adding the possibility to export the resutls makes your results actionable for other user's purposes. Therefor, we evaluate if your current app presents successfully the function to export the rankings previously calculated.",
    "Adding more decision parameters may increase the analytical functionality of the tool! There are many variables that you can extract from the eligible datasets (www.ironhacks.com/task). This measure 'metrics variable'  captures how many variables you have tried to use in relation to all variables available in the eligable datasets."],
  Visualization: [
    'In the challenge description, we specified a two map requirements. You map should visualize the boroughs and you position the map from a future  resident of New York City. The value measures how well you tackle these requirements.', 
    "There are varies ways to visualize data. From barcharts to more novel multidimensional charts. The more variety have the more advanced your visualization, the greater the value displayed.",
    "Our team of info vis experts focuses on two core aspects of information visualization usability: System affordance (Does the application offer recognizable elements and interactions that can be understood by the user?) Cognitive workload (Would a potential user have to memorize a lot of information to carry the task?) You can achieve a score from 0 to 100. All three dimensions are equally weighted.",
    "Representing the mandatory parameters in new ways on the map definitely makes your app standing out from the rest. We will how well you visualize the mandatory datasets (distance, safety, affordability) on your map. The more unique (e.g.interactive) the more advanced your app. For the implication score you can achieve a score from 0 to 100. We evaluate each parameter individually and then average the score across all mandatory variables that you use.", 
    "Adding new data sets on the map definitely makes your app standing out from the rest. We evaluate how successfully you implement additional datasets.  Again, the more interactive the more unique (e.g. interactive) your visualization of the datasets in the map, the better. For the implication score you can achieve a score from 0 to 100. We evaluate each dataset individually and then average the score across all datasets that you use.",
    "Representing the mandatory parameters in new ways on the charts definitely makes your app standing out from the rest. We evaluate how successfully you implement the mandatory parameters. The more unique (e.g. multi-dimensional) your chart visualization, the better your visualization performance. For the implication score you can achieve a score from 0 to 100. We evaluate each variable individually and then average the score across all mandatory variables that you use.", 
    "Visualizing new data sets on the charts definitely makes your app standing out from the rest. We evaluate how successfully you visualize additional data from the eligable list of data sets (www.ironhacks.com/task). The more unique (e.g. multi-dimensional) your chart visualization, the better. For the implication score you can achieve a score from 0 to 100. We evaluate each dataset individually and then average the score across all datasets that you use.",
  ]
}
const DIMENSION_SCORES = {
  'Technology': 'tech_score',
  'Functionality': 'func_score',
  'InfoVis': 'info_vis_score',
  'Novelty': 'novel_score'
}



export default class GeneralTable extends React.Component {
  
  render(){
    const title = <th colSpan={4}>
      {TITLE[this.props.viewType]}
    </th>
    return(
      <div>
        <table className="tables-title">
          <thead >
            <tr>{title}</tr>
          </thead>
        </table>
        {this.calculateTables()}
      </div>
    );
  }
  calculateTables(){
    //showing individual Score
    if(this.props.viewType == VIEW_INDIVIDUAL){
      if(this.props.personalScore !=  0){

        const title = <th colSpan={4}>
          {TITLE[this.props.viewType]}
        </th>
        if(this.props.viewType == VIEW_INDIVIDUAL){
          //Drawing the individual score table
          var headers = []
          var rows = []
          const tableContent = []
          for (var i = 0; i < TABLES_NAMES.length; i++) {
            headers =[TABLES_NAMES[i], TABLE_DESCRIPTIONS[i], 'Your evaluation']
            for (var j = 0; j < DIMENSION_NAMES[TABLES_NAMES[i]].length; j++) {
              rows.push({
                DIMENSION_NAME: DIMENSION_NAMES[TABLES_NAMES[i]][j],
                DIMENSION_DESCRIPTION: DIMENSION_DESCRIPTIONS[TABLES_NAMES[i]][j],
                SCORE: 0
              })
            }

            tableContent.push({
              headers: headers,
              rows: rows
            })
            rows = []
          }
          console.log(tableContent)
          const individualScoreData = tableContent.map((content) => 
          <div className="score-table table-wrapper" key={content.headers[0].toString()}>
            <div className="table-scroll">
              <table>
                <thead >
                  <tr>
                    <th>
                      {content.headers[0]}
                    </th>
                    <th>
                      {content.headers[1]}
                    </th>
                    <th>
                      {content.headers[2]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    content.rows.map((row) => 
                      <tr key={row.DIMENSION_DESCRIPTION.toString()}>
                        <td >{row.DIMENSION_NAME}</td>
                        <td >{row.DIMENSION_DESCRIPTION}</td>
                        <td>{row.SCORE}</td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
          );
          return(
            individualScoreData
          )
        }else{

        }
      }
    }else if(this.props.viewType == VIEW_COMPETITORS){
      console.log(this.props)
      if(this.props.hack_id == 0){
        //This case should never happen, cause we hide the button, but just in case.
        return(
          <div id="tableWrapper">
            <div id="tableScroll">
              <table className="score-table">
                <thead >
                  {this.props.headers}
                </thead>
                <tbody>
                  <tr>
                    <td>{"You should NOT be here >:("}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      }else if(this.props.hack_id == 1){
        //Show only projects
        const samePhaseParticipants = []
        for (var i = 0; i < this.props.generalOP.length; i++) {
          //Check projects...
          if(this.props.generalOP[i].phase_id == this.props.currentPhase){
            samePhaseParticipants.push(this.props.generalOP[i])
          }
        }
        const rows = samePhaseParticipants.map((participant) => 
          <tr key={participant.user_id}>
            <td>
              {"Haker " + participant.hacker_id}
            </td>
            <td>
              <a href={participant.projects}>{"View"}</a> 
            </td>
          </tr>
        )
        return(
          <div className="score-table table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  {this.props.headers}
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        )
      }else if(this.props.hack_id == 2){
        //Show projects and scores
        const samePhaseParticipants = []
        for (var i = 0; i < this.props.generalOP.length; i++) {
          
          //Check projects...
          if(this.props.generalOP[i].phase_id == this.props.currentPhase){
            //... and then ranks  
            for (var j = 0; j < this.props.generalOS.length; j++) {
              if(this.props.generalOP[i].phase_id == this.props.generalOS[j].phase_id &&
                 this.props.generalOP[i].user_id == this.props.generalOS[j].user_id){
                //merging the data
                var participant = {
                  username: this.props.generalOP[i].user_id,
                  hacker_id : this.props.generalOP[i].hacker_id,
                  projects : this.props.generalOP[i].project,
                  phase_id : this.props.generalOP[i].phase_id,
                  rank : this.props.generalOS[j].score
                }
                samePhaseParticipants.push(participant)
                break;
              }
            }
          }
        }
        console.log(samePhaseParticipants)
        const rows = samePhaseParticipants.map((participant) => 
          <tr key={participant.hacker_id}>
            <td>
              {"Haker " + participant.hacker_id}
            </td>
            <td>
              <a href={"participant.projects"}>{"View"}</a> 
            </td>
            <td>
              {participant.rank}
            </td>
          </tr>
        )
        return(
          <div className="score-table table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  {this.props.headers}
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    }
  }
}