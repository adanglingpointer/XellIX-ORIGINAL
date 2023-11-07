import { useState, useRef, React } from "react";
import Xello from "./core/Xello";
import classes from "./css/Query.module.css";
import Header from "./core/Header";
import Xellex from "./core/Xellex";
import Xelve from "./core/Xelve";

function App() {
  const [activeTab, setActiveTab] = useState(<Xello />);

  const changeTab = (parameter, event) => {
    setActiveTab((prev) => {
      return parameter;
    });
  };

  return (
    <>
      <Header />
      <div className={classes.version}>1.0.3</div>
      <div className={classes.tabcontainer}>
        <div className={classes.tab}>
          <button
            className={classes.tablinks}
            onClick={() => {
              changeTab(<Xello />);
            }}
          >
            Lookup
          </button>
          <button
            className={classes.inactivetablinks}
            onClick={() => {
              changeTab(<Xellex />);
            }}
          >
            Fix
          </button>
          <button
            className={classes.inactivetablinks}
            onClick={() => {
              changeTab(<Xelve />);
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
