import React from "react";
import TopicsList from "./topics-list";
import util from "../util";
import Actions from "bloggify/actions";
import ws from "bloggify-ws";
import $ from 'jquery';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: window._pageData
          , topics: null
        };
        let updateTopics = topics => {
            const sticky = [];
            const nonSticky = [];
            topics.sort((a, b) => {
                return a.created_at < b.created_at ? 1 : -1
            });
            topics.forEach(c => {
                if (c.sticky) {
                    sticky.push(c);
                } else {
                    nonSticky.push(c);
                }
            });

            this.setState({ topics: sticky.concat(nonSticky) });
        };

        ws("topic").on("created", topic => {
            const topics = this.state.topics;
            util.normalizeTopic(topic)

            if ([topic.metadata.hack_type, topic.metadata.hack_id].join(":") !== [_pageData.user.profile.hack_type, _pageData.user.profile.hack_id].join(":")) {
                return
            }

            topics.unshift(topic);
            updateTopics(topics);
        }).on("updated", topic => {
            const topics = this.state.topics;
            for (let t of topics) {
                if (t._id === topic._id) {
                    topics[topics.indexOf(t)] = util.normalizeTopic(topic);
                    updateTopics(topics);
                    return;
                }
            }
        })

        Actions.get("posts.list")
          .then(topics => {
              topics.forEach(util.normalizeTopic);
              updateTopics(topics);
          })
        this.clickTracker = {
            username: this.state.user.user.username,
            user_id: this.state.user.user._id,
            hack_id: this.state.user.user.profile.hack_id,
            hack_type: this.state.user.user.profile.hack_type,
            events: []
        }
        
        this.reducedArray = this.reduceArray.bind(this)

        $("body").mousemove(function(e) {
            this.clickTracker["events"].push({x: e.pageX, y: e.pageY})
            if(this.clickTracker["events"].length > 2000){
                this.clickTracker["events"] = this.reducedArray(this.clickTracker["events"])
            }
        }.bind(this));

        $("body").click(function(e) {
            this.clickTracker["events"] = this.reducedArray(this.clickTracker["events"])
        }.bind(this));
        
    }

    reduceArray(array){
        var reducedArray = []
            for (var i = 0; i < array.length; i = i + 2) {
                reducedArray.push(array[i])
            }    
        return reducedArray
    }


    render () {
        return (
            <div>
                <a className="full-width btn-big bgn-green text-center bold btn" href="/new">Post a new topic</a>
                <form action="/search" method="get" className="search-form text-center">
                    <input type="text" name="search" placeholder="Search for something..." />
                </form>
                <TopicsList topics={this.state.topics} />
            </div>
        );
    }
}
