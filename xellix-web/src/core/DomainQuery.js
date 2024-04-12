import { useRef, useState, React } from "react";
import classes from "../css/Query.module.css";

const DomainQuery = (props) => {
  const [buttonState, setButtonState] = useState(classes.kdeg);
  const [firstRoute, setFirstRoute] = useState(true);

  const buttonDown = () => {
    setButtonState(classes.kde);
  };

  const buttonUp = () => {
    setButtonState(classes.kdeg);
  };

  const buttonOver = () => {
    setButtonState(classes.kdehover);
  };

  const inputRef = useRef(null);

  const preventKeys = (event) => {
    const keyRegex = new RegExp(`[^\\d\\w\\.\\-_]`);
    if (
      keyRegex.test(event.key) ||
      (event.code === "Minus" && event.shiftKey)
    ) {
      event.preventDefault();
    }
  };

  const validatePaste = (event) => {
    const pasteRegex = new RegExp(`[^\\d\\w\\.\\-_]`, "g");
    let datat = event.clipboardData.getData("text");
    let datat2 = datat.replace("https://", "");
    let data = datat2.replace("http://", "");
    if (pasteRegex.test(data)) {
      let newText = data.replace(pasteRegex, ""); // replace the matched characters with nothing
      event.preventDefault();
      inputRef.current.value = newText;
    }
  };

  const fetchResponse = async () => {
    var tdomain;
    if (props.routeDomain) {
      tdomain = props.routeDomain;
    } else {
      tdomain = inputRef.current.value;
    }
    let domain = tdomain.trim();
    if (domain === null || domain === "" || domain === "undefined") {
      console.log("no domain");
      inputRef.current.value = "";
      return;
    }
    let validDomainRegex = new RegExp(`[\\d\\w\\.\\-_]+\\.[\\w]{2,6}`);
    if (!validDomainRegex.test(domain)) {
      console.log("invalid domain");
      return;
    }

    props.changeLookupStatus();

    console.log("domain: " + domain);
    const response = await fetch(
      // `http://108.175.11.49:3031/${domain}`
      `https://xellixapi.unlimitedweb.space/${domain}`
      // `https://testapi.unlimitedweb.space/${domain}`
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
      ipOwner: responseData.ipOwner,
    });
  };

  if (props.routeDomain) {
    if (firstRoute == true) {
      setFirstRoute(false);
      fetchResponse();
    }
  }

  return (
    <div className={classes.query}>
      <input
        type="text"
        ref={inputRef}
        onKeyDown={preventKeys}
        onPaste={validatePaste}
        placeholder="domain name"
      />
      <button
        className={buttonState}
        onMouseDown={buttonDown}
        onMouseUp={buttonUp}
        onMouseOut={buttonUp}
        onClick={fetchResponse}
        onMouseOver={buttonOver}
      >
        lookup
      </button>
    </div>
  );
};

export default DomainQuery;
