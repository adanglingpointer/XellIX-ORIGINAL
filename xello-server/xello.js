const axios = require("axios");

const { exec, execSync } = require("child_process");

const { promisify } = require("util");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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
  let portsToCheck = [21, 22, 25, 80, 443];

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

  // find out versioning on Plesk
  if (pleskRegex.test(returnedScan)) {
    let pleskCheck = await pleskScan(domain);
    //let pleskVersionRegex = new RegExp(`http-title:\\sPlesk\\s\\w+\\s[\\d{1,3}.]{2}.\\d+`);
    let pleskVersionRegex = new RegExp(
      `(?:http-title:\\sPlesk\\s)(?<versionName>\\w+)\\s(?<versionNumber>[\\d{1,3}.]{2}.\\d+)`
    );
    //http-title: Plesk Obsidian 18.0.55
    if (pleskVersionRegex.test(pleskCheck)) {
      let match = pleskVersionRegex.exec(pleskCheck);
      console.log(match.groups.versionName);
      console.log(match.groups.versionNumber);

      /*
      // ToDo: Match current version
      axios
        .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
        */
    }
  }

  return { openPorts: openPortList };
};
