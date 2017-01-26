import React from "react";
import { render } from "react-dom";
import Topics from "./posts";
import TopicPage from "./posts/single";
import TopicEditor from "./posts/editor";

window.addEventListener("load", () => {
    if (window._pageData && window._pageData.component) {
        const comps = {
            "topics": <Topics />,
            "topic-page": <TopicPage />,
            "edit-topic": <TopicEditor />,
        };

        const comp = comps[window._pageData.component];
        if (!comp) {
            throw new Error("Invalid component name.");
        }

        render(comp, document.getElementById("app"));
    }
});
