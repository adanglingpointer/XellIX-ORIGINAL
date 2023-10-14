const axios = require("axios");

const { exec, execSync } = require("child_process");

const { promisify } = require("util");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let targetPleskVersionName;
let targetPleskVersionNumber;
var currentVersionName = "wtf";
var currentVersionNumber = "wtf";

app.post("/", async (request, response) => {
  const requestData = request.query.data;
  console.log("we received a request: \n" + requestData);
  let lookupMode;
  const ipRegex = /(\d{1,3}.){4}/;
  if (ipRegex.test(requestData)) {
    lookupMode = "i"; // IP Address
  } else {
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

const pleskVersionMatchFunction = async () => {
  return axios
    .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
    .then(async (response) => {
      let pleskReleaseRegex = new RegExp(
        `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>[\\d{1,3}\.]{2}\.\\d+)`
      );
      //<h2 class="changelog-entry__title">Plesk Obsidian 18.0.56
      let currentVersionMatch = await pleskReleaseRegex.exec(response.data);

      currentVersionName = currentVersionMatch.groups.versionName;
      currentVersionNumber = currentVersionMatch.groups.versionNumber;

      // console.log("currentVersionName "+currentVersionName);
      // console.log("currentVersionNumber "+currentVersionNumber);

      return [currentVersionName, currentVersionNumber];
    })
    .catch((error) => {
      console.error(error);
    });
};

const scanDomain = async (domain) => {
  let openPortList = [];
  let portsToCheck = [21, 22, 25, 80, 443, 8443];

  let returnedScan = await scanPorts(domain);
  let pleskRegex = new RegExp("8443/tcp\\s+open");

  for (const port of portsToCheck) {
    let testingPortRegex = new RegExp(`${port}\/tcp\\s+open`);
    if (testingPortRegex.test(returnedScan)) {
      //console.log(`port ${port} is open`);
      openPortList.push(port);
    }
  }

  // find out versioning of Plesk
  if (pleskRegex.test(returnedScan)) {
    let pleskCheck = await pleskScan(domain);
    let pleskVersionRegex = new RegExp(
      `(?:http-title:\\sPlesk\\s)(?<versionName>\\w+)\\s(?<versionNumber>[\\d{1,3}\.]{2}\.\\d+)`
    );
    //http-title: Plesk Obsidian 18.0.55
    if (pleskVersionRegex.test(pleskCheck)) {
      let targetMatch = pleskVersionRegex.exec(pleskCheck);
      targetPleskVersionName = targetMatch.groups.versionName;
      targetPleskVersionNumber = targetMatch.groups.versionNumber;

      let currentVersionObject;
      await pleskVersionMatchFunction()
        .then((data) => {
          currentVersionObject = data;
        })
        .catch((error) => console.error(error));

      console.log("currentVersionName " + currentVersionName);
    }
  } else {
    targetPleskVersionName = "undetected";
    targetPleskVersionNumber = "undetected";
  }

  return {
    openPorts: openPortList,
    targetPleskName: targetPleskVersionName,
    targetPleskVersion: targetPleskVersionNumber,
    currentPleskName: currentVersionName,
    currentPleskVersion: currentVersionNumber,
    anotherValue: "1",
  };
};
