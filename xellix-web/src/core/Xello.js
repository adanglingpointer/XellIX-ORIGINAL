import React, { useState } from "react";
import classes from "../css/Query.module.css";

import Header from "./Header";
import DomainQuery from "./DomainQuery";

var information = "";

const Xello = (props) => {
  const [lookupStatus, setLookupStatus] = useState("idle");

  const changeLookupStatus = () => {
    setLookupStatus("pending");
  };

  const resetLookupStatus = () => {
    setLookupStatus("idle");
  };

  const updatePage = (displayInfo) => {
    if (lookupStatus === "pending") {
      console.log("we messed up");
      information = "";
    }
    information = (
      <div className={classes.lbox}>
        <div className={classes.infopanel}>
          <p>
            <h2>{displayInfo.queryDomain}</h2>
          </p>
        </div>

        <div className={classes.infopanel}>
          <h3>Open ports:</h3>
          <ul>
            {displayInfo.openPorts.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>

        <div className={classes.infopanel}>
          <h3>Mail server(s):</h3>
          <ul>
            {displayInfo.mailServer.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <p className={classes.lookup}>{lookupStatus}</p>
      <DomainQuery
        changeLookupStatus={changeLookupStatus}
        resetLookupStatus={resetLookupStatus}
        updatePage={updatePage}
      />

      <p>{information}</p>
    </>
  );
};

export default Xello;
