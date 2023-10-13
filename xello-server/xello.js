const axios = require("axios");

const { exec, execSync } = require("child_process");

const { promisify } = require("util");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let targetPleskVersionName;
let targetPleskVersionNumber;
let currentVersionName;
var currentVersionName2;
let currentVersionNumber;
var currentVersionNumber2;

app.post("/", async (request, response) => {
  const requestData = request.query.data;
  console.log("we received a request: \n" + requestData);
  let lookupMode;
  const ipRegex = /(\d{1,3}.){4}/;
  if (ipRegex.test(requestData)) {
    lookupMode = "i"; // IP Address
  } else {
    console.log("we've made it into lookup mode");
    let lookupDomain = requestData;
    let sendResponse = await scanDomain(lookupDomain);
    response.send(sendResponse);
  }
});

app.listen(process.env.PORT || 3031, () => {
  console.log("Server started on port 3031");
});

const scanPorts = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(`nmap -F ${domain}`);
    if (stdout) {
      return stdout;
    }
    if (stderr) {
      return "error: " + stderr;
    }
  } catch (err) {
    return "error: " + err;
  }
};

const pleskScan = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      `nmap -A -p 8443 ${domain}`
    );
    if (stdout) {
      return stdout;
    }
    if (stderr) {
      return "error: " + stderr;
    }
  } catch (err) {
    return "error: " + err;
  }
};



const scanDomain = async (domain) => {
  console.log("we've made it into scanDomain()");
  let openPortList = [];
  let portsToCheck = [21, 22, 25, 80, 443, 8443];

  let returnedScan = await scanPorts(domain);
  let pleskRegex = new RegExp("8443/tcp\\s+open");
  /*
  let testString = "8443/tcp open   https-alt";
  console.log(pleskRegex.test(testString));  //true
  */

  //console.log("returnedScan is: \n"+returnedScan);

  for (const port of portsToCheck) {
    let testingPortRegex = new RegExp(`${port}\/tcp\\s+open`);
    //console.log("regex is: \n"+testingPortRegex);
    if (testingPortRegex.test(returnedScan)) {
      //console.log(`port ${port} is open`);
      openPortList.push(port);
    }
  }

  // find out versioning of Plesk
  if (pleskRegex.test(returnedScan)) {
    let pleskCheck = await pleskScan(domain);
    //let pleskVersionRegex = new RegExp(`http-title:\\sPlesk\\s\\w+\\s[\\d{1,3}.]{2}.\\d+`);
    let pleskVersionRegex = new RegExp(
      `(?:http-title:\\sPlesk\\s)(?<versionName>\\w+)\\s(?<versionNumber>[\\d{1,3}.]{2}.\\d+)`
    );
    //http-title: Plesk Obsidian 18.0.55
    if (pleskVersionRegex.test(pleskCheck)) {
      let targetMatch = pleskVersionRegex.exec(pleskCheck);
      // console.log(match.groups.versionName);
      // console.log(match.groups.versionNumber);
      targetPleskVersionName = targetMatch.groups.versionName;
      targetPleskVersionNumber = targetMatch.groups.versionNumber;

      // ToDo: Match current version
      axios
        .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
        //<h2 class="changelog-entry__title">Plesk Obsidian 18.0.56
        .then(async (response) => {
          //  console.log(response.data);

          let pleskReleaseRegex = new RegExp(
            `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>[\\d{1,3}.]{2}.\\d+)`
          );
          let currentVersionMatch = await pleskReleaseRegex.exec(response.data);

          currentVersionName = currentVersionMatch.groups.versionName;
          currentVersionName2 = currentVersionName;
          currentVersionNumber = currentVersionMatch.groups.versionNumber;
          currentVersionNumber2 = currentVersionNumber;
          if (pleskReleaseRegex.test(response.data)) {
            console.log(
              "true: \n" +
                targetPleskVersionName +
                " " +
                targetPleskVersionNumber +
                "==" +
                currentVersionName +
                " " +
                currentVersionNumber
            );
            
  /* Only returns 1... */
  // return {
  //   openPorts: openPortList,
  //   targetPleskName: targetPleskVersionName,
  //   targetPleskVersion: targetPleskVersionNumber,
  //   currentPleskName: currentVersionName,
  //   currentPleskVersion: currentVersionNumber,
  //   currentPleskName2: currentVersionName2,
  //   currentPleskVersion2: currentVersionNumber2,
  //   anotherValue: "1"
  // };
          } else {
            console.log(
              "false: \n" +
                targetPleskVersionName +
                " " +
                targetPleskVersionNumber +
                "!=" +
                currentVersionName +
                " " +
                currentVersionNumber
            );
            
  /* Only returns 1... */
  // return {
  //   openPorts: openPortList,
  //   targetPleskName: targetPleskVersionName,
  //   targetPleskVersion: targetPleskVersionNumber,
  //   currentPleskName: currentVersionName,
  //   currentPleskVersion: currentVersionNumber,
  //   currentPleskName2: currentVersionName2,
  //   currentPleskVersion2: currentVersionNumber2,
  //   anotherValue: "1"
  // };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  } else {
    targetPleskVersionName = "undetected";
    targetPleskVersionNumber = "undetected";
  }

  // Server refuses to send currentVersionName and currentVersionNumber.
  // A challenge for another day.

  // return {
  //   openPorts: openPortList,
  //   targetPleskName: targetPleskVersionName,
  //   targetPleskVersion: targetPleskVersionNumber,
  //   currentPleskName: currentVersionName,
  //   currentPleskVersion: currentVersionNumber,
  //   currentPleskName2: currentVersionName2,
  //   currentPleskVersion2: currentVersionNumber2,
  //   anotherValue: "1"
  // };
};
