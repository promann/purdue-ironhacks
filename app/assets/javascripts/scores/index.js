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
  }
  render(){
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
        </div>  
        </div>
        <div className="row">
          <div className="col-md-3">
                  <CalendarHeatmap
                    startDate={new Date('2018-03-01')}
                    endDate={new Date('2018-05-31')}
                    classForValue={this.githubClassForValue}
                    values={values}
                  />
          </div>
          <div className="col-md-9">
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
      return(
        <tr>
          <th>Perfomance Dimension</th>
          <th>Description</th>
          <th>Measure type</th>
          <th>Your Result</th>
        </tr>
      );
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
    this.setState({currentView: VIEW_COMPETITORS})
  }
  onSliderChange(event){
    var globalPhase = 0
    console.log(this.state.personalScore)
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
      console.log(this.state.currentUser)
      Actions.get("scores.getPersonalScores")
          .then(scores => {
            console.log(scores)
              this.setState({personalScore: scores})
              //Once we get the projects from the user, we identify  the treatment, and then ask for the adition data, if it needed.
              this.getTreatmentData(this.state.currentUser.profile.hack_id)
          })
  }
  pullGeneralOS(){
    console.log(this.state.currentUser)
    Actions.get("scores.getGeneralOS")
        .then(scores => {
            this.setState({generalOS: scores})
        })
  }
  pullGeneralOP(){
    console.log(this.state.currentUser)
    Actions.get("scores.getGeneralOP")
        .then(scores => {
            this.setState({generalOP: scores})
        })
  }
  getTreatmentData(treatmentCase){
      console.log(treatmentCase)
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