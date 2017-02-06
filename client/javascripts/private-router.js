import React from "react";
import Countdown from "./countdown";
import ComponentLoader from "./component-loader";
import AdminView from "./admin";
import Scores from "./scores";

alert("This is a test. If you see this message, just close it.");

ComponentLoader.register("countdown", <Countdown />);
ComponentLoader.register("admin-view", <AdminView />);
ComponentLoader.register("scores", <Scores />);
