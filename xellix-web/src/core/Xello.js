import React, { useState } from "react";
import classes from "../css/Query.module.css";
import loading from "./images/loading.gif";

import DomainQuery from "./DomainQuery";

var information = "";

const Xello = (props) => {
  const [lookupStatus, setLookupStatus] = useState("idle");

  const changeLookupStatus = () => {
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
  var phpReturn;
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
            <p>Invalid query</p>
          </div>
        </div>
      );
    } else {
      if (
        displayInfo.targetPleskName != "undetected" &&
        displayInfo.targetPleskName != "unknown"
      ) {
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

      var itIsIonosNs = false;
      displayInfo.nameServers.map((element) => {
        if (element.includes(".ui-dns.")) {
          itIsIonosNs = true;
        }
      });

      var spfErrorOutput = "";
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
        spfErrorOutput = (
          <div className={classes.infopanel}>
            <h3>SPF record missing:</h3>
            <p>
              No SPF record was found. This can prevent email delivery and allow
              spoofing.
              <br />
              <br />
              <a href="https://www.ionos.com/help/domains/configuring-mail-servers-and-other-related-records/using-ionos-spf-to-improve-email-delivery/">
                SPF for IONOS mail servers
              </a>
              <br />
              <br />
              <a href="https://support.plesk.com/hc/en-us/articles/12377800694423-What-is-SPF-and-how-to-configure-it-on-a-Plesk-server">
                SPF for Plesk mail servers
              </a>
            </p>
          </div>
        );
      } else {
        spfMode = "";
      }
      if (
        displayInfo.domainRegistrar.includes("1and1") ||
        displayInfo.domainRegistrar.includes("ionos")
      ) {
        registrar = (
          <img src="https://www.ionos.com/favicon.ico" width="50px" />
        );
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

      var targetPhpToFloat = parseFloat(displayInfo.targetPhpVersion);

      if (
        displayInfo.targetPhpVersion !== "undetected" &&
        targetPhpToFloat < 8
      ) {
        phpOutdated = "oudated ❕";
      }
      if (
        displayInfo.targetPhpVersion !== "undetected" &&
        targetPhpToFloat >= 8
      ) {
        phpOutdated = "up to date ✅";
      }

      if (displayInfo.targetPhpVersion) {
        phpReturn = (
          <div className={classes.infopanel}>
            <h3>PHP version:</h3>
            <p>
              {displayInfo.targetPhpVersion}
              <br />
              {phpOutdated}
            </p>
          </div>
        );
      }

      if (
        displayInfo.domainSecondaryIps !== "" ||
        displayInfo.domainSecondaryIps !== "undefined" ||
        displayInfo.domainSecondaryIps !== null
      ) {
        secondaryIParray = displayInfo.domainSecondaryIps.split(" ");
      }

      var sslErrorReturn;
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
        sslErrorReturn = (
          <div className={classes.infopanel}>
            <h3>SSL Expiration Date:</h3>
            <p>
              {displayInfo.sslExpiry}
              <br />
              SSL expired ❕<br />
              <br />
              <a href="https://www.ionos.com/help/server-cloud-infrastructure/accordions-to-plesk-panel/administration/installing-an-ssl-certificate-in-plesk-linux-or-windows-servers/">
                Installing an SSL Certificate in Plesk
              </a>
              <br />
              <br />
              <a href="https://help.unlimitedweb.space/how-to-install-a-lets-encrypt-ssl-in-apache-on-debian-ubuntu/">
                Installing a Let’s Encrypt SSL in Apache on Debian/Ubuntu
              </a>
              <br />
              <br />
              <a href="https://projectsilica.com/sslapache.html">
                How To Install SSL Files on Apache in Ubuntu/Debian
              </a>
              <br />
              <br />
              <a href="https://www.ionos.com/help/ssl-certificates/setting-up-user-managed-ssl-certificates/installing-an-ssl-certificate-on-a-windows-server/">
                Install an SSL on Windows/IIS
              </a>
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

      var missingMailServer = "";
      if (displayInfo.mailServer.length < 1 && itIsIonosNs == false) {
        missingMailServer = (
          <div className={classes.infopanel}>
            <h3>Missing mail server:</h3>
            <p>
              No mail server (MX records) found. This will prevent the domain
              from receiving email.
            </p>
          </div>
        );
      }
      if (displayInfo.mailServer.length < 1 && itIsIonosNs == true) {
        missingMailServer = (
          <div className={classes.infopanel}>
            <h3>Missing mail server:</h3>
            <p>
              No mail server (MX records) found. This will prevent the domain
              from receiving email.
              <br />
              <br />
              <a href="https://www.ionos.com/help/email/troubleshooting-mail-basicmail-business/adjust-mx-records-for-receiving-email-via-ionos-mail-servers/">
                Adjust MX Records for Receiving Email via IONOS Mail servers
              </a>
              <br />
              <br />
              <a href="https://www.ionos.com/help/domains/configuring-mail-servers-and-other-related-records/using-a-domain-with-another-providers-mail-servers-editing-mx-records/">
                Using a Domain with Another Provider's Mail Servers (Editing MX
                Records)
              </a>
            </p>
          </div>
        );
      }

      var ipOwner;
      if (displayInfo.ipOwner !== "undefined") {
        ipOwner = (
          <div className={classes.infopanel}>
            <h3>IP WhoIs:</h3>
            <p>{displayInfo.ipOwner}</p>
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
        displayInfo.sslExpired === "true" ||
        missingMailServer
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
              {spfMode === "SPF missing ❕" ? spfErrorOutput : ""}
              {sslErrorReturn ? sslErrorReturn : null}
              {missingMailServer}
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

          {ipOwner}

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

          {displayInfo.targetPhpVersion !== "undetected" ? phpReturn : null}

          {sslReturn}

          {problems}
        </div>
      );
    }
  };

  return (
    <>
      <p className={classes.lookup}>{lookupStatus}</p>
      <DomainQuery
        changeLookupStatus={changeLookupStatus}
        resetLookupStatus={resetLookupStatus}
        updatePage={updatePage}
        routeDomain={props.routeDomain}
      />

      <p>{information}</p>
    </>
  );
};

export default Xello;
