import React from "react";
import Countdown from "./countdown";
import ComponentLoader from "./component-loader";
import AdminView from "./admin";
import Scores from "./scores";

ComponentLoader.register("countdown", <Countdown />);
ComponentLoader.register("admin-view", <AdminView />);
ComponentLoader.register("scores", <Scores />);
