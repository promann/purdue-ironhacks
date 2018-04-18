import React from 'react';
import Actions from 'bloggify/actions';

// Constants
const VIEW_INDIVIDUAL = 'FEEDBACK';
const VIEW_COMPETITORS = 'COMPETITORS';
const TITLE = {
  FEEDBACK : "INDIVIDUAL FEEDBACK",
  COMPETITORS : "GENERAL SCORE"
}
const DIMENSION_NAMES = ["Technology", "Functionality", "InfoVis", "Novelty"]
const DIMENSION_DESCRIPTION = ["Tech requirements: You are expected to meet all 10 technological requirements specified in the challenge description (www.ironhacks.com/task). All requirements are equally weighted. The more more requirements you meet the better", "Error rating: We evaluate the quality of your code by counting the errors and diving it by the total number of lines of code. The lower the value the better your code.", "System affordance: Does the application offer recognizable elements and interactions that can be understood by the user? ", "Adding new data sets definitely makes your app stand (take out the three letters) out from the rest. We evaluate how successfully you implement additional open datasets: How relevant are they for you're the application? How novel is the visualization of this data? We evaluate each dataset individually and average it across all datasets."]
const MEASURE_TYPE_DESCRIPTION = ["Error rating", "Number of technology", "Number of user requirements met", "Usability point achieved"]
const DIMENSION_SCORES = {
  'Technology': 'tech_score',
  'Functionality': 'func_score',
  'InfoVis': 'info_vis_score',
  'Novelty': 'novel_score'
}

export default class GeneralTable extends React.Component {
	constructor (props) {
    super(props);
    this.state = {

    }

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
          const rows = []
          for (var i = 0; i < 4; i++) {
            const currentDimension = DIMENSION_SCORES[DIMENSION_NAMES[i]]
            rows.push({
              DIMESION_NAMES: DIMENSION_NAMES[i],
              DIMENSION_DESCRIPTION: DIMENSION_DESCRIPTION[i],
              MEASURE_TYPE_DESCRIPTION: MEASURE_TYPE_DESCRIPTION[i],
              SCORE: this.props.personalScore[currentDimension]
            })
          }
          const individualScoreData = rows.map((row) => 
          <div className="score-table table-wrapper" key={row.DIMESION_NAMES.toString()}>
            <div className="table-scroll">
              <table>
                <thead >
                  <tr>
                    <th colSpan={4}>
                      {row.DIMESION_NAMES}
                    </th>
                  </tr>
                  {this.props.headers}
                </thead>
                <tbody>
                   <tr>
                      <td rowSpan={3}>{row.DIMESION_NAMES}</td>
                      <td>{row.DIMENSION_DESCRIPTION}</td>
                      <td >{row.MEASURE_TYPE_DESCRIPTION}</td>
                      <td rowSpan={3}>{row.SCORE}</td>
                   </tr>
                   <tr>
                      <td>{row.DIMENSION_DESCRIPTION}</td>
                      <td >{row.MEASURE_TYPE_DESCRIPTION}</td>
                   </tr>
                   <tr>
                      <td>{row.DIMENSION_DESCRIPTION}</td>
                      <td >{row.MEASURE_TYPE_DESCRIPTION}</td>
                   </tr>
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
      if(this.props.hack_id == 1){
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
              <a href={participant.project}>{"View"}</a> 
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
              console.log("lala")
              if(this.props.generalOP[i].phase_id == this.props.generalOS[j].phase_id &&
                 this.props.generalOP[i].user_id == this.props.generalOS[j].user_id){
                //merging the data
                var participant = {
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
              <a href={participant.project}>{"View"}</a> 
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
}