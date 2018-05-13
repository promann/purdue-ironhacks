import React from 'react';
import Actions from 'bloggify/actions';

// Constants
const VIEW_INDIVIDUAL = 'FEEDBACK';
const VIEW_COMPETITORS = 'COMPETITORS';
const TOP_TEXT = {
  FEEDBACK : <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>How to read your personal feedback:</strong></p>
    <p>There are three rows that describe your apps performance in the three task dimensions: (1) <strong style={{'color': '#F39D26'}}>Technology</strong>, (2) <strong style={{'color': '#F39D26'}}>Analytics</strong>, (3) <strong style={{'color': '#F39D26'}}>Visualization</strong>. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually. So the more points the better. </p>
    <p style={{'textAlign': 'center'}}><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
  </div>
}
const BOTTOM_TEXT = {
  FEEDBACK : <div style={{'textAlign': 'center', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
  </div>
}
const INDIVIDUAL_SCORE_HEADERS = ["Decision Parameter", "Description", "Poinst gained"]
const DECISION_PARAMETER_NAMES = ["Technology", "Analytics", "Visualization"]
const DIMENSION_DESCRIPTIONS = {
  Technology: <div style={{'textAlign': 'left'}}>
    <p>Here, you find the performance of the software code of your app!</p>
    <ul>
      <li>As a programmer it is important to write flawless code!</li>
      <li>Also keep in mind that a programmer has to comply to the technological requirements!</li>
      <li>We evaluate the quality of your code depending on the errors and the total number of lines of code.</li>
      <li>Remember that you are expected to meet all technological requirements specified in the challenge description (<a href="www.ironhacks.com/task">www.ironhacks.com/task</a>).</li>
    </ul>
    <p>Check out how well you do!</p>
  </div>,
  Analytics: <div style={{'textAlign': 'left'}}>
    <p>Below, you can find out how well you master the analytical expectations of the app user! Remember, the wanted to find the optimal solution! How close did you get in mastering the analytical challenges? Check out below:</p>
    <p>As specified in the task (www.ironhacks.com/task), you were asked to correctly rank the districts with respect to three parameters (distance, safety, afforability); this measures accounts whether you correctly find the 10 best districts for each parameter individually  and all jointly (ranking considering all three parameters jointly). The value describes how many correct ranks you have identified for all 4 ranking decision parameters.</p>
    <p>Adding the possibility to export the resutls makes your results actionable for other user's purposes. Therefor, we evaluate if your current app presents successfully the function to export the rankings previously calculated.</p>
    <p>Adding more decision parameters may increase the analytical functionality of the tool! There are many parameters that you can extract from the eligible datasets (www.ironhacks.com/task). This measure 'metrics parameter'  captures how many parameters you have tried to use in relation to all parameters available in the eligable datasets.</p>
   </div>,
  Visualization: <div style={{'textAlign': 'left'}}>
    <p>Our team of info vis experts focuses on two core aspects of information visualization usability: System affordance (Does the application offer recognizable elements and interactions that can be understood by the user?) Cognitive workload (Would a potential user have to memorize a lot of information to carry the task?) You can achieve a score from 0 to 100. All three dimensions are equally weighted.</p>
    <p>Representing the mandatory parameters in new ways on the map definitely makes your app standing out from the rest. We will how well you visualize the mandatory datasets (distance, safety, affordability) on your map. The more unique (e.g.interactive) the more advanced your app. For the implication score you can achieve a score from 0 to 100. We evaluate each parameter individually and then average the score across all mandatory parameters that you use.</p>
    <p>Adding new data sets on the map definitely makes your app standing out from the rest. We evaluate how successfully you implement additional datasets.  Again, the more interactive the more unique (e.g. interactive) your visualization of the datasets in the map, the better. For the evaluation you can achieve from 0 to 100. We evaluate the visual implementation of each dataset used individually and then average the score across all datasets that you use.</p>
    <p>Representing the mandatory parameters in new ways on the charts definitely makes your app standing out from the rest. We evaluate how successfully you implement the mandatory parameters. The more unique (e.g. multi-dimensional) your chart visualization, the better your visualization performance. For the implication score you can achieve a score from 0 to 100. We evaluate each parameter individually and then average the score across all mandatory parameters that you use.</p>
    <p>Visualizing new data sets on the charts definitely makes your app standing out from the rest. We evaluate how successfully you visualize additional data from the eligable list of data sets (www.ironhacks.com/task). The more unique (e.g. multi-dimensional) your chart visualization, the better. For the evaluation you can achieve from 0 to 100. We evaluate the visual implementation of each dataset individually and then average the score across all datasets that you use.</p>
    </div>
}
const DIMENSION_SCORES = {
  'Technology': 'tech_score',
  'Analytics': 'ana_score',
  'Visualization': 'vis_score'
}


export default class GeneralTable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
    //Binding
    this.onGeneralTableButtonClick = this.onGeneralTableButtonClick.bind(this)
    this.compareHackers = this.compareHackers.bind(this)
  }
  render(){
    return(
      <div>
        {this.calculateTables()}
      </div>
    );
  }
  calculateTables(){
    //showing individual Score
    if(this.props.viewType == VIEW_INDIVIDUAL){
      if(this.props.personalScore.length >  0){
        //Drawing the individual score table
        var headers = []
        var rows = []
        const tableContent = []
        headers =[INDIVIDUAL_SCORE_HEADERS[0], INDIVIDUAL_SCORE_HEADERS[1], INDIVIDUAL_SCORE_HEADERS[2]]
        for (var j = 0; j < DECISION_PARAMETER_NAMES.length; j++) {
          rows.push({
            DIMENSION_NAME: DECISION_PARAMETER_NAMES[j],
            DIMENSION_DESCRIPTION: DIMENSION_DESCRIPTIONS[DECISION_PARAMETER_NAMES[j]],
            SCORE: this.props.personalScore[0][DIMENSION_SCORES[DECISION_PARAMETER_NAMES[j]]]
          })
        }

        tableContent.push({
          headers: headers,
          rows: rows
        })
        rows = []
        const individualScoreData = tableContent.map((content, i) =>
        <div>
          <div>
            {TOP_TEXT['FEEDBACK']}
          </div>
          <div className="score-table table-wrapper" key={content.headers[i].toString()}>
            <div className="table-scroll">
              <table>
                <thead>
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
                      <tr key={row.DIMENSION_NAME.toString()}>
                        <td><strong>{row.DIMENSION_NAME}</strong></td>
                        <td>{row.DIMENSION_DESCRIPTION}</td>
                        <td>{row.SCORE}</td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
            <div>
            {BOTTOM_TEXT['FEEDBACK']}
            </div>
        </div>
        );
        return(
          individualScoreData
        )
      }
    }else if(this.props.viewType == VIEW_COMPETITORS){
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
        const topText = <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
          <p><strong style={{'color': '#F39D26'}}>Check out others' work:</strong> Also, please take a look at your fellow participants’ solutions. It’s a great way to learn how to improve your performance and gear up for the next round! </p>
          <p><strong>Click on the link</strong> to check out other's code! You can <strong style={{'color': '#F39D26'}}>inspect</strong> it, and also <strong style={{'color': '#F39D26'}}>reuse</strong> it if you want to! It is allowed and actually encouraged! Go for it, learn from others. <strong>Only 50%</strong> of the code needs to be <strong>from yourself!</strong> Do not worry! " </p>
          <br/>
          <p style={{'textAlign': 'center'}}><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
        </div>
        const bottomText = <div style={{'textAlign': 'center', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
          <p><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
        </div>
        //Show only projects
        const samePhaseParticipants = []
        for (var i = 0; i < this.props.generalOP.length; i++) {
          //Check projects...
          if(this.props.generalOP[i].phase_id == this.props.currentPhase){
            samePhaseParticipants.push(this.props.generalOP[i])
          }
        }
        //Sorting participants
        samePhaseParticipants.sort(this.compareHackers)
        const rows = samePhaseParticipants.map(function(participant){
          if(participant.user_id == this.props.user.username){
            return(
              <tr key={participant.hacker_id} style={{'backgroundColor': 'lightgray'}}>
                <td>
                  {"You"}
                </td>
                <td>
                  <WatchedAnchor 
                    link={participant.projects}
                    user={this.props.user}
                    phaseId={participant.phase_id}
                    projectOwner={participant.username}
                  /> 
                </td>
              </tr>
            )
          }else{
            return(
              <tr key={participant.hacker_id}>
                <td>
                  {"Hacker " + participant.hacker_id}
                </td>
                <td>
                  <WatchedAnchor 
                    link={participant.projects}
                    user={this.props.user}
                    phaseId={participant.phase_id}
                    projectOwner={participant.username}
                  /> 
                </td>
              </tr>
            )
          }
        }.bind(this))
        return(
          <div>
            <div>
              {topText}
            </div>
                <table>
                  <thead>
                    {this.props.headers}
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
            <div>
              {bottomText}
            </div>
          </div>
        )
      }else if(this.props.hack_id == 2){
        const topText = <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
          <p><strong style={{'color': '#F39D26'}}>Check out others' work:</strong> Below, you find a table with your competitors in your hacking group, links to their <strong style={{'color': '#F39D26'}}>apps</strong>, and also their <strong style={{'color': '#F39D26'}}>rankings</strong>.The link takes you to their code. Please take a look at your fellow participants’ solutions.</p>
          <p><strong>How to read the rankings?</strong></p> 
          <p>We use percentile scores to rank the app. <strong>Remember</strong>: A percentile rank achieved by you indicates the percentage of participants in your hacking contest who achieved a LOWER performance than you. So <strong><em>the higher</em></strong> your percentile ranking <strong><em>the better!</em></strong></p>
          <br/>
          <p style={{'textAlign': 'center'}}><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
        </div>
        const bottomText = <div style={{'textAlign': 'center', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
          <p><em><strong>CONFIDENTIALITY NOTE:</strong> <u>This information is confidential</u></em> and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</p>
        </div>
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
                  rank : this.props.generalOS[j].score,
                  hacker_position: this.props.generalOP[i].hacker_position
                }
                samePhaseParticipants.push(participant)
                break;
              }
            }
          }
        }
        //Sorting participants
        samePhaseParticipants.sort(this.compareHackers)
        const rows = samePhaseParticipants.map(function(participant){
          if(participant.username == this.props.user.username){
            return(
            <tr key={participant.hacker_id} style={{'backgroundColor': 'lightgray'}}>
              <td>
                {"You"}
              </td>
              <td>
                <WatchedAnchor 
                  link={participant.projects}
                  user={this.props.user}
                  phaseId={participant.phase_id}
                  projectOwner={participant.username}
                /> 
              </td>
              <td>
                {participant.rank}
              </td>
            </tr>
            )
          }else{
            return(
            <tr key={participant.hacker_id}>
              <td>
                {"Hacker " + participant.hacker_id}
              </td>
              <td>
                <WatchedAnchor 
                  link={participant.projects}
                  user={this.props.user}
                  phaseId={participant.phase_id}
                  projectOwner={participant.username}
                /> 
              </td>
              <td>
                {participant.rank}
              </td>
            </tr>
            )
          }
        }.bind(this))
        return(
          <div>
            <div>
              {topText}
            </div>
            
                <table>
                  <thead>
                    {this.props.headers}
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
            <div>
              {bottomText}
            </div>
          </div>
        )
      }
    }
  }
  //Click tracker funcs
  onGeneralTableButtonClick(object, object2) {
  }
  //This function sort the hacker array by hacker_position
  compareHackers(a,b) {
  if (a.hacker_position < b.hacker_position)
    return -1;
  if (a.hacker_position > b.hacker_position)
    return 1;
  return 0;
  }
}
//Class to track the click
class WatchedAnchor extends React.Component {
  constructor(props){
    super(props)
    link = this.props.link
    this.onClick = function( event ){
      event.preventDefault();
      Actions.post("stats.insert", {
        event: "on_click_link_project_general_score",
        metadata: {
          user_object_id: this.props.user._id,
          timestamp: new Date(),
          hack_id_clicker: this.props.user._id,
          hack_type: this.props.user.profile.hack_type,
          clicker_username: this.props.user.username,
          project: this.props.link,
          owner: this.props.projectOwner,
          phase_id: this.props.phaseId
        }
      });
      
      // After receiving some response from the DB API, then you can call something like
      if(this.props.user.profile.hack_type == "CUPL_spring_2018"){
        setTimeout(function(){
          window.location.href = document.location.href + "/libraries?" + this.props.projectOwner
        }.bind(this), 750 )
      }else{
        setTimeout(function(){
          window.location.href = link
        }, 750 )
      }
    }.bind(this)
  }
  render(){
    if(this.props.user.profile.hack_type == "CUPL_spring_2018"){
      //Changing the links for the libraries show:
      return (
        <a href={ document.location.href + "/libraries?" + this.props.projectOwner} onClick={(e) => {this.onClick(e)}}>View</a>
      )
    }else{
      return (
        <a href={ this.props.link } onClick={(e) => {this.onClick(e)}}>View</a>
      )
    }
  }
}