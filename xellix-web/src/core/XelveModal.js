import { useState, useRef, React } from "react";
import classes from "../css/XelveModal.module.css";

const XelveModal = (props) => {
  const [buttonState, setButtonState] = useState(classes.kdeg);
  let warningDialogue = `By clicking Install you agree that UnlimitedWeb.space, it's subdomains, affiliates, partners, and developer(s) are not responsible for any damages caused by this application.  By using this application to install a Graphical User Interface (GUI) and remote desktop service you understand that you must have at least 5 GB of free space available.  This tool should only be used on a freshly imaged server.  By clicking Install you agree that you have the rights to install on the specified machine.`;
  const installTitle = props.tagline;
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [properIp, setProperIp] = useState(false);
  const [serverIPClass, setServerIPClass] = useState(null);
  const [properPass, setProperPass] = useState(false);
  const [userPassClass, setUserPassClass] = useState(null);

  const inputRef1 = useRef(null);
  const serverIp = useRef(null);
  const serverPass = useRef(null);
  const newuser = useRef(null);
  const userpass = useRef(null);
  const responseRef = useRef(null);

  const buttonDown = () => {
    setButtonState(classes.kde);
  };

  const buttonUp = () => {
    if (buttonState == classes.disabled) {
      return;
    }
    setButtonState(classes.kdeg);
  };

  const buttonOver = () => {
    setButtonState(classes.kdehover);
  };

  const changeAgree = () => {
    setAgreeTerms(!agreeTerms);
  };

  const goInstall = async () => {
    setButtonState(classes.disabled);
    responseRef.current.value = "Connecting...\n";
    console.log("props.chosenOs is " + props.chosenOs);
     var fetchInstaller = await fetch("http://108.175.11.49:3031/install", {
    // var fetchInstaller = await fetch("https://xellixapi.unlimitedweb.space/install", {
    //     var fetchInstaller = await fetch("https://testapi.unlimitedweb.space/install", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: serverIp.current.value,
          password: serverPass.current.value,
          chosenOs: props.chosenOs,
          newuser: newuser.current.value,
          userpass: userpass.current.value,
        }),
      }
    )
      .then(async (response) => {
        const decoder = new TextDecoder();

        const reader = response.body.getReader();
        let done, value;
        while (!done) {
          ({ value, done } = await reader.read());
          if (done) {
            break;
          }
          const text = decoder.decode(value);
          if (responseRef && responseRef.current && text) {
            let cacheLockRegex1 = new RegExp(/[Ww]aiting for cache lock/);
            if (cacheLockRegex1.test(text)) {
              responseRef.current.value += "\n" + text;
              responseRef.current.value +=
                "\n" +
                "It seems that apt is already running.  " +
                "Please try again in a few minutes.";
              responseRef.current.scrollTop = responseRef.current.scrollHeight;
            } else {
              responseRef.current.value += "\n" + text;
              responseRef.current.scrollTop = responseRef.current.scrollHeight;
            }
          }
        }

        // the old method, leaving this here in case we really break everything
        /*
      for (const data of response.body) {
        const text = decoder.decode(data);
        console.log(text);
        // setTheResponse(text);
        responseRef.current.value += "\n" + text;
        responseRef.current.scrollTop = responseRef.current.scrollHeight;
      }
        */
      })
      .catch((err) => {
        responseRef.current.value +=
          "\n" +
          "SSH connection error:  Password authentication failed, host refused, or host is down";
        responseRef.current.value += "\n" + err;
      });
  };

  const installerButton = (
    <button
      onClick={goInstall}
      className={buttonState}
      onMouseDown={buttonDown}
      onMouseUp={buttonUp}
      onMouseOut={buttonUp}
      onMouseOver={buttonOver}
    >
      Install
    </button>
  );

  const checkIp = () => {
    const ipRegex = new RegExp(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    );
    if (ipRegex.test(serverIp.current.value)) {
      console.log(true);
      setProperIp(true);
      setServerIPClass(classes.happyinput);
    } else {
      console.log(false);
      setProperIp(false);
      setServerIPClass(classes.badinput);
    }
    if (
      serverIp.current.value.includes("127.0.0.1") ||
      serverIp.current.value.includes("74.208.157.83") ||
      serverIp.current.value.includes("74.208.244.148")
    ) {
      console.log(false);
      setProperIp(false);
      setServerIPClass(classes.badinput);
    }
  };

  const checkPass = () => {
    function validate(password) {
      var minMaxLength = /^[\s\S]{6,32}$/,
        upper = /[A-Z]/,
        lower = /[a-z]/,
        number = /[0-9]/,
        special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

      if (
        minMaxLength.test(password) &&
        upper.test(password) &&
        lower.test(password) &&
        number.test(password) &&
        special.test(password)
      ) {
        return true;
      }

      return false;
    }

    let testPass = validate(userpass.current.value);

    if (testPass === true) {
      setProperPass(true);
      setUserPassClass(classes.happyinput);
    } else {
      setProperPass(false);
      setUserPassClass(classes.badinput);
    }
  };

  const exitModal = () => {
    props.xelveModal();
  };

  return (
    <div className={classes.modal}>
      <span className={classes.modalheader}>
        {" "}
        {installTitle}{" "}
        <button className={classes.exit} onClick={exitModal}>
          x
        </button>
      </span>
      <label for="target">Server IP:</label>{" "}
      <input
        type="text"
        id="target"
        name="target"
        className={serverIPClass}
        ref={serverIp}
        onChange={checkIp}
      />
      <br />
      <label for="user">Username:</label>{" "}
      <input
        type="text"
        value="root"
        id="user"
        name="user"
        className={classes.user}
      />
      <br />
      <label for="password">Password:</label>{" "}
      <input
        type="password"
        placeholder="password"
        id="password"
        name="password"
        ref={serverPass}
      />
      <br />
      <label for="newuser">New user to create:</label>{" "}
      <input
        type="text"
        placeholder="newuser1"
        id="newuser"
        name="newuser"
        ref={newuser}
      />
      <br />
      <label for="userpass">New user's password:</label>{" "}
      <input
        type="password"
        placeholder="password"
        id="userpass"
        name="userpass"
        className={userPassClass}
        ref={userpass}
        onChange={checkPass}
      />
      <br />
      <span class={classes.tinytext}>
        Must be at least <strong>6 characters long</strong> and contain at least
        one of each: <br />
        <strong>upper case</strong>, <strong>lower case</strong>,{" "}
        <strong>number</strong>, and <strong>special characters</strong>.
      </span>
      <br />
      <label for="agreeterms">I agree to the terms below</label>{" "}
      <input
        type="checkbox"
        id="agreeterms"
        name="agreeterms"
        ref={inputRef1}
        onClick={changeAgree}
      />
      <br />
      {agreeTerms && properIp && properPass && userpass.current.value !== null
        ? installerButton
        : null}
      <br />
      <textarea className={classes.terminal} ref={responseRef}>
        {warningDialogue}
      </textarea>
      <span class={classes.tinytext}>
        Installer will continue to run even if you exit. Please expect 5-15
        minutes.
      </span>
    </div>
  );
};

export default XelveModal;
