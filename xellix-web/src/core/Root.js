import { Outlet } from "react-router-dom";
import Header from "./Header";
// import classes from "../css/Query.module.css";

import { React, useState } from "react";
import classes from "../css/Header.module.css";
import Xello from "./Xello";
import Xelve from "./Xelve";

function RootLayout() {
  const [activeTab, setActiveTab] = useState(<Xello />);
  const [xelloTab, setXelloTab] = useState(classes.activetablink);
  const [xelveTab, setXelveTab] = useState(classes.tablinks);

  const changeTab = (parameter, event) => {
    if (!parameter) {
      return <Xello />;
    }
    setActiveTab((prev) => {
      return parameter;
    });
  };

  var xellexPlaceholder; // = <Xellex />;
  var xelvePlaceholder = <Xelve />;

  return (
    <>
      <Header />
      <div className={classes.tabcontainer}>
        <div className={classes.tab}>
          <button
            className={xelloTab}
            onClick={() => {
              changeTab(<Xello />);
              setXelloTab(classes.activetablink);
              setXelveTab(classes.tablinks);
            }}
          >
            Lookup
          </button>
          <button
            className={classes.inactivetablinks}
            onClick={() => {
              changeTab(xellexPlaceholder);
            }}
          >
            Fix
          </button>
          <button
            className={xelveTab}
            onClick={() => {
              changeTab(xelvePlaceholder);
              setXelloTab(classes.tablinks);
              setXelveTab(classes.activetablink);
            }}
          >
            Install
          </button>
        </div>
        {activeTab}
      </div>
      <Outlet />
    </>
  );
}

export default RootLayout;
