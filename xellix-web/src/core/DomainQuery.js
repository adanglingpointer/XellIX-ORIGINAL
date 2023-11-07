import { useEffect, useRef, React } from "react";
import classes from "../css/Query.module.css";

const DomainQuery = (props) => {
  useEffect(() => {
    //
  });

  var once = 0;

  const inputRef = useRef(null);

  const clearInput = () => {};

  const fetchResponse = async () => {
    var inputTrimmed = inputRef.current.value.trim();
    if (inputTrimmed == "" || inputTrimmed == null) {
      console.log("no domain");
      inputRef.current.value = "";
      return;
    }
    props.changeLookupStatus();
    let tdomain = inputRef.current.value;
    let domain = tdomain.trim();
    if (domain === null || domain === "" || domain === "undefined") {
      console.log("no domain");
      inputRef.current.value = "";
      return;
    }
    console.log("domain: " + domain);
    const response = await fetch(
      // `http://108.175.11.49:3031/${domain}`
       `https://xellixapi.unlimitedweb.space/${domain}`
    );
    if (!response.ok) {
      //throw new Error("Whoopsies! We have an error =[");
      //console.log(response);
    }
    const responseData = await response.json();
    console.log(responseData.mailServer);
    props.resetLookupStatus();
    props.updatePage({
      queryDomain: domain,
      openPorts: responseData.openPorts,
      mailServer: responseData.mailServer,
      mxUnresolved: responseData.mxUnresolved,
      spfRecord: responseData.spfRecord,
      targetPleskName: responseData.targetPleskName,
      targetPleskVersion: responseData.targetPleskVersion,
      currentPleskName: responseData.currentPleskName,
      currentPleskVersion: responseData.currentPleskVersion,
      targetWordPressVersion: responseData.targetWordPressVersion,
      currentWordPressVersion: responseData.currentWordPressVersion,
      targetPhpVersion: responseData.targetPhpVersion,
      domainMainIp: responseData.domainMainIp,
      domainSecondaryIps: responseData.domainSecondaryIps,
      reverseDNS: responseData.reverseDNS,
      hostName: responseData.hostName,
      domainRegistrar: responseData.domainRegistrar,
      nameServers: responseData.nameServers,
      sslExpiry: responseData.sslExpiry,
      sslExpired: responseData.sslExpired,
      nsMissingDNS: responseData.nsMissingDNS,
      nsClosed: responseData.nsClosed,
      nsFiltered: responseData.nsFiltered,
      queryDate: responseData.queryDate,
      error: responseData.error,
    });
  };

  return (
    <div className={classes.query}>
      <input type="text" ref={inputRef} placeholder="domain name" />
      <button onClick={fetchResponse}>lookup</button>
    </div>
  );
};

export default DomainQuery;
