import { useState, useRef, React } from "react";
import Xello from "./core/Xello";
import classes from "./css/Query.module.css";
import Header from "./core/Header";
import Xellex from "./core/Xellex";
import Xelve from "./core/Xelve";

function App() {
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
      <div className={classes.version}>1.1.0</div>
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

export default App;
