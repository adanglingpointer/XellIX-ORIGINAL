import { React, useState } from "react";
import classes from "../css/Header.module.css";
import Xello from "./Xello";
import Xelve from "./Xelve";
import { useParams } from "react-router-dom";

function QueryContainer() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(
    <Xello routeDomain={params.domain} />
  );
  const [xelloTab, setXelloTab] = useState(classes.activetablink);
  const [xelveTab, setXelveTab] = useState(classes.tablinks);

  const changeTab = (parameter, event) => {
    if (!parameter) {
      return <Xello routeDomain={params.domain} />;
    }
    setActiveTab((prev) => {
      return parameter;
    });
  };

  var xellexPlaceholder; // = <Xellex />;
  var xelvePlaceholder = <Xelve />;

  return (
    <>
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
    </>
  );
}

export default QueryContainer;
