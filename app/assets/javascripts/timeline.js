import React from "react";
import ucFirst from "uc-first";
import CountdownTimer from "./timer";

export default class App extends React.Component {
    render () {
        const tutorialLink = _pageData.tutorial_link;
        let timelineTitle = ucFirst(_pageData.user.profile.hack_type);
        switch (timelineTitle) {
            case "Bogota":
                timelineTitle = `Purdue – UNAL Gold IronHacks ${new Date().getFullYear()}`;
                break;
            case "Platzi":
                timelineTitle = `Purdue – Platzi Black IronHacks ${new Date().getFullYear()}`;
                break;
            case "Purdue":
                timelineTitle = `Purdue Gold IronHacks Spring ${new Date().getFullYear()}`;
                break;
        }

        let tutorialButton = null;
        if (tutorialLink) {
            tutorialButton = <p><a href={tutorialLink} className="btn">Please start the tutorial here</a></p>;
        }

        let timelineContainer = null;
        if (_pageData.timeline_img) {
            timelineContainer = <div>
                <h1>Timeline for <strong>{timelineTitle}</strong></h1>
                <img src={_pageData.timeline_img} />
            </div>;
        }

        return (
            <div className="text-center">
                <h1>Welcome!</h1>
                {tutorialButton}
                <CountdownTimer description="Time until the forum starts:" until={_pageData.forum_start_time} />
                <CountdownTimer description="Time until the hack starts:" until={_pageData.hack_start_time} />
                {timelineContainer}
            </div>
        );
    }
}
