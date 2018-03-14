import * as React from "react";
import {render} from "react-dom";
import {AppComponent} from "./components/appComponent";


window.React = React;
render(
    <AppComponent/>
  ,document.getElementById("react-container")
);