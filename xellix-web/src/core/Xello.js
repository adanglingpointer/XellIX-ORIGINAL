import React, { useState } from "react";
import classes from "../css/Query.module.css";
import loading from "./images/loading.gif";

import Header from "./Header";
import DomainQuery from "./DomainQuery";

var information = "";

const Xello = (props) => {
  const [lookupStatus, setLookupStatus] = useState("idle");

  const changeLookupStatus = () => {
    //setLookupStatus("pending");
    setLookupStatus(<img src={loading} height="75px" />);
  };

  const resetLookupStatus = () => {
    setLookupStatus("idle");
  };

  var pleskReturn;
  var pleskOutdated = false;
  var outdatedPlesk;
  var spfMode;
  var registrar;
  var phpOutdated;
  var wpReturn;
  var wpOutdated = false;
  var secondaryIParray = [];
  var sslReturn = "";
  const updatePage = (displayInfo) => {
    if (lookupStatus === "pending") {
      console.log("we messed up");
      information = "";
    }
    if (displayInfo.error && displayInfo.error === "error") {
      console.log("displayInfo.error is " + displayInfo.error);
      information = (
        <div className={classes.lbox}>
          <div className={classes.infopaneld}>
            <p>
              <h2>{displayInfo.queryDomain}</h2>
              <p className={classes.query}>
                Query Timestamp: {displayInfo.queryDate}
              </p>
            </p>
          </div>
  
          <div className={classes.infopanelp}>
            <h2>Error</h2>
            <p>
              Invalid query
            </p>
          </div>
          </div>
      );

    } else  {
      console.log("displayInfo.error is " + displayInfo.error);
    if (displayInfo.targetPleskName != "undetected" && displayInfo.targetPleskName != "unknown") {
      if (
        displayInfo.currentPleskName === displayInfo.targetPleskName &&
        displayInfo.currentPleskVersion === displayInfo.targetPleskVersion
      ) {
        outdatedPlesk = "Up to date ✅";
        pleskOutdated = false;
      } else {
        outdatedPlesk = "Plesk is Outdated ❕";
        pleskOutdated = true;
      }
      pleskReturn = (
        <div className={classes.infopanel}>
          <h3>Host Plesk Version:</h3>
          <p>
            {displayInfo.targetPleskName}
            <br />
            {displayInfo.targetPleskVersion}
            <br />
            {outdatedPlesk}
          </p>
        </div>
      );
    } else {
      pleskReturn = "";
    }
    if (displayInfo.targetWordPressVersion != "undetected") {
      if (
        displayInfo.currentWordPressVersion !=
        displayInfo.targetWordPressVersion
      ) {
        wpOutdated = true;
        wpReturn = (
          <div className={classes.infopanel}>
            <h3>WordPress:</h3>
            <p>
              {displayInfo.currentWordPressVersion}
              <br />
              "WordPress is Outdated ❕"
            </p>
          </div>
        );
      } else {
        wpReturn = (
          <div className={classes.infopanel}>
            <h3>WordPress:</h3>
            <p>
              {displayInfo.currentWordPressVersion}
              <br />
              "Up to date ✅"
            </p>
          </div>
        );
      }
    } else {
      wpReturn = "";
    }
    if (
      displayInfo.spfRecord !== "missing" &&
      displayInfo.spfRecord.endsWith("~all")
    ) {
      spfMode = "soft fail ❕";
    } else if (
      displayInfo.spfRecord !== "missing" &&
      displayInfo.spfRecord.endsWith("-all")
    ) {
      spfMode = "hard fail ✅";
    } else if (displayInfo.spfRecord == "missing") {
      spfMode = "SPF missing ❕";
    } else {
      spfMode = "";
    }
    if (
      displayInfo.domainRegistrar.includes("1and1") ||
      displayInfo.domainRegistrar.includes("ionos")
    ) {
      registrar = <img src="https://www.ionos.com/favicon.ico" width="50px" />;
    } else if (displayInfo.domainRegistrar.includes("enom")) {
      registrar = (
        <img
          src="https://149463845.v2.pressablecdn.com/wp-content/uploads/2022/12/cropped-enom-favicon-cropped-32x32.png"
          width="50px"
        />
      );
    } else {
      registrar = "";
    }
    if (
      displayInfo.targetPhpVersion !== "undetected" &&
      displayInfo.targetPhpVersion < 8.0
    ) {
      phpOutdated = "oudated ❕";
    }
    if (
      displayInfo.targetPhpVersion !== "undetected" &&
      displayInfo.targetPhpVersion >= 8.0
    ) {
      phpOutdated = "up to date ✅";
    }
    if (
      displayInfo.domainSecondaryIps !== "" ||
      displayInfo.domainSecondaryIps !== "undefined" ||
      displayInfo.domainSecondaryIps !== null
    ) {
      secondaryIParray = displayInfo.domainSecondaryIps.split(" ");
    }

    if (displayInfo.sslExpired === "true") {
      sslReturn = (
        <div className={classes.infopanel}>
          <h3>SSL Expiration Date:</h3>
          <p>
            {displayInfo.sslExpiry}
            <br />
            SSL expired ❕
          </p>
        </div>
      );
    }

    if (displayInfo.sslExpired === "false") {
      sslReturn = (
        <div className={classes.infopanel}>
          <h3>SSL Expiration Date:</h3>
          <p>
            {displayInfo.sslExpiry}
            <br />
            SSL up to date ✅
          </p>
        </div>
      );
    }

    var missingDNS = "";
    if (displayInfo.nsMissingDNS.length > 0) {
      missingDNS = (
        <div className={classes.infopanel}>
          <h3>Name servers missing IPs:</h3>
          <ul>
            {displayInfo.nsMissingDNS.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>
      );
    }

    var closedNS = "";
    if (displayInfo.nsClosed.length > 0) {
      closedNS = (
        <div className={classes.infopanel}>
          <h3>Name servers with port 53 closed:</h3>
          <ul>
            {displayInfo.nsClosed.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>
      );
    }

    var filteredNS = "";
    if (displayInfo.nsFiltered.length > 0) {
      filteredNS = (
        <div className={classes.infopanel}>
          <h3>Name servers with port 53 filtered:</h3>
          <ul>
            {displayInfo.nsFiltered.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>
      );
    }

    var unresolvedMX = "";
    if (displayInfo.mxUnresolved.length > 0) {
      unresolvedMX = (
        <div className={classes.infopanel}>
          <h3>MX records missing IPs:</h3>
          <ul>
            {displayInfo.mxUnresolved.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>
      );
    }

    var problems = "";

    if (
      missingDNS !== "" ||
      closedNS !== "" ||
      filteredNS !== "" ||
      unresolvedMX !== "" ||
      pleskOutdated ||
      wpOutdated === true ||
      displayInfo.sslExpired === true ||
      spfMode === "SPF missing ❕" ||
      displayInfo.sslExpired === "true"
    ) {
      problems = (
        <div className={classes.infopanelp}>
          <h2>Problems:</h2>
          <p>
            {missingDNS}
            {closedNS}
            {filteredNS}
            {unresolvedMX}
            {pleskOutdated ? (
              <p>
                Plesk is Outdated ❕<br />
              </p>
            ) : (
              ""
            )}
            {wpOutdated ? (
              <p>
                WordPress is Outdated ❕<br />
              </p>
            ) : (
              ""
            )}
            {spfMode === "SPF missing ❕" ? spfMode : ""}
            {displayInfo.sslExpired === "true" ? <p>SSL is Expired ❕</p> : ""}
          </p>
        </div>
      );
    }

    information = (
      <div className={classes.lbox}>
        <div className={classes.infopaneld}>
          <p>
            <h2>{displayInfo.queryDomain}</h2>
            <p className={classes.query}>
              Query Timestamp: {displayInfo.queryDate}
            </p>
          </p>
        </div>

        <div className={classes.infopanel}>
          <h3>Registrar:</h3>
          <p>
            {displayInfo.domainRegistrar}
            <br />
            {registrar}
          </p>
        </div>

        <div className={classes.infopanel}>
          <h3>Name servers:</h3>
          <ul>
            {displayInfo.nameServers.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        </div>

        <div className={classes.infopanel}>
          <h3>IP:</h3>
          <p>{displayInfo.domainMainIp}</p>
        </div>

        <div className={classes.infopanel}>
          <h3>Secondary IPs:</h3>
          <ul>
            {secondaryIParray.map((IP) => {
              return <li>{IP}</li>;
            })}
          </ul>
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

        <div className={classes.infopanel}>
          <h3>Reverse DNS (PTR):</h3>
          <p>{displayInfo.reverseDNS}</p>
        </div>

        <div className={classes.infopanel}>
          <h3>Hostname:</h3>
          <p>{displayInfo.hostName}</p>
        </div>

        <div className={classes.infopanel}>
          <h3>SPF Record:</h3>
          <p>
            {displayInfo.spfRecord}
            <br />
            {spfMode}
          </p>
        </div>

        {pleskReturn}

        {wpReturn}

        {sslReturn}

        {problems}
      </div>
    );
  }
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
