import React from "react";
import ucFirst from "uc-first";

export default class App extends React.Component {

    constructor (props) {
        super(props);
        const end = new Date(_pageData.end_time);
        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;
        const _day = _hour * 24;

        const showRemaining = noRender => {
            const now = new Date();
            const distance = end - now;
            let message = "";

            if (distance < 0) {
                clearInterval(timer);
                window.location = "/";
                message = '';
            } else {
                const days = Math.floor(distance / _day);
                const hours = Math.floor((distance % _day) / _hour);
                const minutes = Math.floor((distance % _hour) / _minute);
                const seconds = Math.floor((distance % _minute) / _second);
                message = `${days} days ${hours} hrs ${minutes} mins ${seconds} secs`
            }

            if (!noRender) {
                this.setState({
                    countdown_value:  message
                });
            }

            return message;
        };

        const timer = setInterval(showRemaining, 1000);
        this.state = {
            countdown_value: showRemaining(true)
        };
    }

    render () {
        const tutorialLink = _pageData.tutorial_link;
        let timelineTitle = ucFirst(_pageData.user.profile.hack_type);
        if (timelineTitle === "Bogota") {
            timelineTitle = `Purdue UNAL ${timelineTitle}`;
        }

        let tutorialButton = null;
        if (tutorialLink) {
            tutorialButton = <p><a href={tutorialLink} className="btn">Please start the tutorial here</a></p>;
        }

        let timelineContainer = null;
        if (_pageData.timeline_img) {
            timelineContainer = <div>
                <h3>Timeline for <strong>{timelineTitle}</strong></h3>
                <img src={_pageData.timeline_img} />
            </div>;
        }

        return (
            <div className="text-center">
                <h1>Welcome!</h1>
                {tutorialButton}
                <span className="countdown">{this.state.countdown_value}</span>
                {timelineContainer}
            </div>
        );
    }
}
