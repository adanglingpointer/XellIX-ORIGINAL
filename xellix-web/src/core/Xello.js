import React, { useState } from "react";
import classes from "../css/Query.module.css";

import Header from "./Header";
import DomainQuery from "./DomainQuery";

var information = "";

const Xello = (props) => {

  const [lookupStatus, setLookupStatus] = useState("idle");

  const changeLookupStatus = () => {
    setLookupStatus("pending")
  }

  const resetLookupStatus = () => {
    setLookupStatus("idle")
  }

  const updatePage = (displayInfo) => {
    if (lookupStatus === "pending") {
      console.log("we messed up");
      information = "";
    }
    information = <div className={classes.infopanel}>
    <p><h2>google.com</h2></p>
    <strong>Mail server:</strong> {displayInfo.mailServer}
    </div>;
  }


  return (
    <>
      <Header />
      <DomainQuery changeLookupStatus={changeLookupStatus} resetLookupStatus={resetLookupStatus} updatePage={updatePage} />
      <p className={classes.lookup}>{lookupStatus}</p>
      <p>{information}</p>
    </>
  );
};

export default Xello;
