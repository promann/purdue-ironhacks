 //ADV

// Dependencies
import React from 'react';
import List from './list';
import CalendarHeatmap from 'react-calendar-heatmap';
import Actions from 'bloggify/actions';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import GeneralTable from './generalTable'

// Constants
const VIEW_INDIVIDUAL = 'FEEDBACK';
const VIEW_COMPETITORS = 'COMPETITORS';

const PHASE_0_MESSAGE = <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
  <p><strong>Welcome to your personal dashboard!</strong></p>
  <p>You are on your personalized feedback page. On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization.</p>
  <p> Currently, there are no results yet available since Phase 1 has not been completed. After the evaluation phase 1, you should immediately return here and review your results. You are evaluations are private and confidential. Do not share them with others! Stick to the Purdue's honor's code!</p>
</div>
const TREATMENT_1_TEXT = {
  PHASE_1_MESSAGE : <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome to your personal dashboard!</strong> You are on your personalized feedback page. On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase 1.</p>
    <p><strong>How to read those results:</strong> There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually. Remember that your evaluations are <strong>private and confidential</strong>. Do not share them with others. Remember the Purdue's honors code.</p>
  </div>,
  AFTER_PHASE_1_MESSAGE: <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome back to your personal dashboard!</strong> You are on your personalized feedback page. On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase X. You can view the results of prior phases by using the slider in the slide bar above.</p>
    <p>How to read those results: There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually.</p>
    <p>Remember that your evaluations are private and confidential.</p> 
    </div>
}
const TREATMENT_2_TEXT = {
  PHASE_1_MESSAGE : <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome back to your personal dashboard!</strong></p>
    <p>On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase 1.</p>
    <p>There are two view: "your personal feedback" (private and confidential) and "your competitors" (showing what other's are doing).</p>
    <p><strong>How to read your personal feedback.</strong> There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually.</p>
    <p>Remember that your evaluations are private and confidential. Nobody else can see it. And you shouldn't share it with others.</p>
    <p>Check out your competitors: Also, please take a look at your fellow participants’ solutions. Just click on the tap "My competitors" above and you can see other's apps. It’s a great way to learn how to improve your performance and gear up for the next round! Clck on the link to check out other's code!.</p>
  </div>,
  AFTER_PHASE_1_MESSAGE: <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome back to your personal dashboard!</strong></p> 
    <p>On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase X. You can view the results of prior phases by using the slider in the slide bar above.</p>
    <p>There are two view: "your personal feedback" (private and confidential) and "your competitors" (showing what other's are doing).</p>
    <p><strong>How to read your personal feedback.</strong> There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually.</p>
    <p>Remember that your evaluations are private and confidential. Nobody else can see it. And you shouldn't share it with others.  </p>
    <p>Check out your competitors: Also, please take a look at your fellow participants’ solutions. Just click on the tap "My competitors" above and you can see other's apps. It’s a great way to learn how to improve your performance and gear up for the next round! Click on the link to check out other's code!</p>
    </div>
}
const TREATMENT_3_TEXT = {
  PHASE_1_MESSAGE : <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome back to your personal dashboard!</strong></p> 
    <p>On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase 1.</p>
    <p>There are two view: <strong>"your personal feedback"</strong> (private and confidential) and <strong>"your competitors"</strong> (showing what other's are doing).</p>
    <p><strong>How to read your personal feedback.</strong> There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually.</p>
    <p>Remember that your evaluations are private and confidential. Nobody else can see it. And you shouldn't share it with others.</p>
    <p><strong>Check out your competitors:</strong> Also, please take a look at your fellow participants’ solutions. Just click on the tap <strong>"My competitors"</strong> above and you can see other's apps. It’s a great way to learn how to improve your performance and gear up for the next round! Click on the link to check out other's code! You also find ranking (leaderboard) of your competitors. We use perecentile scores to rank the app. A percentile rank achieved by  you indicates the percentage of participants in your hacking contest who achieved a lower performance than you. </p>
  </div>,
  AFTER_PHASE_1_MESSAGE: <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
    <p><strong>Welcome back to your personal dashboard!</strong></p>
    <p>On this page, you can review the evaluations for your app in a very detailed way for each category: Technology, Analytics, and Visualization. Below are the results for Phase X. You can view the results of prior phases by using the slider in the slide bar above.</p>
    <p>There are two view: "your personal feedback" (private and confidential) and "your competitors" (showing what other's are doing).</p>
    <p>How to read your personal feedback. There are three different scrowable tables with a range of metrics that measure the quality of your submission in your current phase. Keep pushing to increase the quality of your app. The better the quality the higher your reward eventually.</p>
    <p>Remember that your evaluations are private and confidential. Nobody else can see it. And you shouldn't share it with others. </p>
    <p>Check out your competitors: Also, please take a look at your fellow participants’ solutions. Just click on the tap "My competitors" above and you can see other's apps. It’s a great way to learn how to improve your performance and gear up for the next round!  lick on the link to check out other's code! You also find ranking (leaderboard) of your competitors. We use perecentile scores to rank the app. A percentile rank achieved by  you indicates the percentage of participants in your hacking contest who achieved a lower performance than you.</p>
    </div>
}
const DASHBOARD_TEXT = {
  0: TREATMENT_1_TEXT,
  1: TREATMENT_2_TEXT,
  2: TREATMENT_3_TEXT
}
const CONFIDENTIALITY_MESSAGE = <div style={{'textAlign': 'justify', 'marginTop' : '30px', 'marginBottom' : '30px'}}>
  <p><strong>CONFIDENTIALITY NOTE: This information is confidential and should not be shared with other participants in your hack! Follow the rules of IronHacks and do not share this information.</strong></p>
</div>

//Main Component
export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentUser: window._pageData.user,
      hackers:  window._pageData.hackers,
      currentPhase: 1,
      currentView: VIEW_INDIVIDUAL,
      personalScore : [],
      generalOS : [],
      generalOP : []
    }
    //Binding
    this.showIndividual = this.showIndividual.bind(this)
    this.showCompetitors = this.showCompetitors.bind(this)
    this.onSliderChange = this.onSliderChange.bind(this)
    this.getTreatmentData = this.getTreatmentData.bind(this)
    this.setGeneralTablePhase = this.setGeneralTablePhase.bind(this)
    this.state.currentUser.profile.hack_id = 2
  }
  render(){
    //Select the text according with the phase
    var text = <div></div>
    if(this.state.personalScore.length == 0){
      text = PHASE_0_MESSAGE
    }else if(this.state.personalScore.length == 1){
      text = DASHBOARD_TEXT[this.state.currentUser.profile.hack_id].PHASE_1_MESSAGE
    }else{
      text = DASHBOARD_TEXT[this.state.currentUser.profile.hack_id].AFTER_PHASE_1_MESSAGE
    }
    const viewIndividual = this.state.currentView === VIEW_INDIVIDUAL;
    const viewCompetitors = this.state.currentView === VIEW_COMPETITORS;
    const showGeneralScoreButton = this.state.currentUser.profile.hack_id == 0
    const hackers = this.state.hackers.filter(c => {
      return c.score_total || c.github_repo_url || c.project_url
    })
    //Putting the data in the correct format
    const calendarKeys = Object.keys(_pageData.calendar_values)
    const values = []
    for (var i = 0; i < calendarKeys.length; i++) {
      values.push({date: calendarKeys[i], count: _pageData.calendar_values[calendarKeys[i]]})
    }
    return(
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <img src={this.state.currentUser.profile.picture} id="profilePicture"/>
              <CalendarHeatmap
                startDate={new Date('2018-03-01')}
                endDate={new Date('2018-05-31')}
                classForValue={this.githubClassForValue}
                values={values}
              />
            </div>
          <div className="col-md-7 offset-md-1">
            <div className="phases-div">
              <ReactBootstrapSlider step={1} max={5} min={1} orientation="horizontal" id="phaseSlider"
                ticks={[1, 2, 3, 4, 5]}
                ticks_labels={['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5']}
                value={this.state.currentPhase}
                change={this.onSliderChange}
              />
            </div>
            <div>
              {text}
            </div>
          </div>  
          </div>
          <div className="row">
            <div className="col-md-9 offset-md-3"
                style={{'display': this.state.personalScore.length > 0 ? 'inline-block' : 'none'}}>
              <div className="row">
                <div className="col-md-6">
                  <div>
                    <button 
                      className={'nav-button' + (viewIndividual ? ' active' : '')} 
                      onClick={this.showIndividual} 
                    >INDIVIDUAL FEEDBACK</button>
                    <button 
                      className={'nav-button' + (viewCompetitors ? ' active' : '')}
                      onClick={this.showCompetitors}
                      style={{'display': showGeneralScoreButton ? 'none' : 'inline-block'}}
                    >YOUR COMPETITORS</button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <GeneralTable
                    viewType={this.state.currentView}
                    headers={this.calculateHeaders()}
                    hack_id={this.state.currentUser.profile.hack_id}
                    personalScore={this.setGeneralTablePhase()}
                    generalOS={this.state.generalOS}
                    generalOP={this.state.generalOP}
                    currentPhase={this.state.currentPhase}
                    user={this.state.currentUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    //Getting current user data
    this.pullPersonalScore() 
  }
  setGeneralTablePhase(){
    if(this.state.personalScore.length > 0){
      for (var i = 0; i < this.state.personalScore.length; i++) {
        if(this.state.personalScore[i].phase_id == this.state.currentPhase){
          return this.state.personalScore[i]
        }
      }
    }
    return 0
  }
  calculateHeaders(){
    if(this.state.currentView == VIEW_INDIVIDUAL){
    }else{
      if(this.state.currentUser.profile.hack_id == 1){
        return(
          <tr>
            <th>
              {"Name"}
            </th>
            <th>
              {"Project"}
            </th>
          </tr>
        )
      }else if(this.state.currentUser.profile.hack_id == 2){
        return(
          <tr>
            <th>
              {"Name"}
            </th>
            <th>
              {"Project"}
            </th>
            <th>
              {"Rank"}
            </th>
          </tr>
        )
      }
    }
  }
  showIndividual(){
    this.setState({currentView: VIEW_INDIVIDUAL})
  }
  showCompetitors(){
    //Sending stats to db
    Actions.post("stats.insert", {
        event: "on_click_show_general_score_table",
        metadata: {
          user_object_id: this.state.currentUser._id,
          clicker_username: this.state.currentUser.username,
          phase_id: this.state.currentPhase
        }
      });
    this.setState({currentView: VIEW_COMPETITORS})
  }
  onSliderChange(event){
    var globalPhase = 0
    for (var i = 0; i < this.state.personalScore.length; i++) {
      if(this.state.personalScore[i].phase_id > globalPhase){
        globalPhase = this.state.personalScore[i].phase_id
      }
    }
    if(event.target.value <= globalPhase){
      this.setState({currentPhase: event.target.value})
    }else{
      this.forceUpdate();
    }
  }
  pullPersonalScore(){
      Actions.get("scores.getPersonalScores")
          .then(scores => {
              this.setState({personalScore: scores})
            if(scores.length != 0){
              //No scores available, we are still in phase 1.
              //Once we get the projects from the user, we identify  the treatment, and then ask for the adition data, if it needed.
              this.getTreatmentData(this.state.currentUser.profile.hack_id)
            }
          })
  }
  pullGeneralOS(){
    Actions.get("scores.getGeneralOS")
        .then(scores => {
            this.setState({generalOS: scores})
        })
  }
  pullGeneralOP(){
    Actions.get("scores.getGeneralOP")
        .then(scores => {
            this.setState({generalOP: scores})
        })
  }
  getTreatmentData(treatmentCase){
      if(treatmentCase == 0){
        //Only personal data
      }else if(treatmentCase == 1){
        //Personal Data and project links
        this.pullGeneralOP()
      }else if(treatmentCase == 2){
        //Personal Data, project links and general score
        this.pullGeneralOP()
        this.pullGeneralOS()
      }
  }

}
//ADV