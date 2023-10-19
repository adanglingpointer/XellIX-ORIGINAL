const axios = require("axios");

const { exec, execSync } = require("child_process");

const { promisify } = require("util");

const express = require("express");
const bodyParser = require("body-parser");
const { stdout, stderr } = require("process");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let targetPleskVersionName;
let targetPleskVersionNumber;
var currentVersionName = "undefined";
var currentVersionNumber = "undefined";
var foundMissingMx = [];

app.post("/", async (request, response) => {
  const requestData = request.query.data;
  console.log("we received a request: \n" + requestData);
  let lookupMode;
  const ipRegex = /(\d{1,3}.){4}/;
  if (ipRegex.test(requestData)) {
    lookupMode = "i"; // IP Address
    let lookupDomain = requestData;
    let sendResponse = await scanDomain(lookupDomain);
    response.send(sendResponse);
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
    const { stdout, stderr } = await promisify(exec)(`nmap -F -sS ${domain}`);
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
      //      `nmap -A -p 8443 ${domain}`
      `nmap -sC -sS --traceroute -F ${domain}`
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

//  lookup current version of Plesk offered
const pleskVersionMatchFunction = async () => {
  return axios
    .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
    .then(async (response) => {
      // let pleskReleaseRegex = new RegExp(
      //   `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>[\\d{1,3}\.]{2}\.\\d+)`
      // );
      let pleskReleaseRegex = new RegExp(
        `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>\\d{1,3}[.]\\d{1,3}[.]\\d{1,3})`
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

//  lookup current version of WordPress offered
//  TODO!!!
const wordpressVersionMatchFunction = async () => {
  return axios
    .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
    .then(async (response) => {
      // let pleskReleaseRegex = new RegExp(
      //   `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>[\\d{1,3}\.]{2}\.\\d+)`
      // );
      let pleskReleaseRegex = new RegExp(
        `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>\\d{1,3}[.]\\d{1,3}[.]\\d{1,3})`
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

//  lookup domain's MX records
const digForMx = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(`dig mx ${domain}`);
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

//  resolve MX records
const pingMx = async (mailDomain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(`ping ${mailDomain} -c 1`);
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

//  lookup SPF record
const digForTxt = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(`dig txt ${domain}`);
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

//  lookup hostname
const nmapForHostname = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      `nmap -sV -sS -p 25 ${domain}`
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

//  detect WordPress & PHP
const curlForWordpress = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      `curl -I ${domain}/wp-login.php`
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

/* Domain Scanning Function */

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
    // if Plesk port is open
    let pleskCheck = await pleskScan(domain);
    let pleskVersionRegex = new RegExp(
      `(?:http-title:\\sPlesk\\s)(?<versionName>\\w+)\\s(?<versionNumber>\\d{1,3}[.]\\d{1,3}[.]\\d{1,3})`
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
    // Plesk port not open
    targetPleskVersionName = "undetected";
    targetPleskVersionNumber = "undetected";
  }

  // match IP addresses
  // Nmap scan report for unlimitedweb.space (74.208.157.83)
  let ipMatchingRegex = new RegExp(
    `Nmap scan report for ${domain} \\((?<ipAddress>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})\\)`
  );
  if (ipMatchingRegex.test(returnedScan)) {
    // we've found an IPv4
    let ipMatch = ipMatchingRegex.exec(returnedScan);
    var primaryIpAddress = ipMatch.groups.ipAddress;
    //console.log(primaryIpAddress);
  } else {
    // no IPv4 found
    var primaryIpAddress = "undefined";
  }
  // Other addresses for unlimitedweb.space (not scanned): 2607:f1c0:1800:239::1
  // Other addresses for yahoo.com (not scanned): 98.137.11.164 74.6.143.25 2001:4998:44:3507::8000 2001:4998:124:1507::f001
  let secondaryIpMatchingRegex = new RegExp(
    `Other addresses for ${domain} \\(not scanned\\): (?<secondaryIps>.+\\b)`
  );
  if (secondaryIpMatchingRegex.test(returnedScan)) {
    // found secondary IPs
    let secondaryIpMatch = secondaryIpMatchingRegex.exec(returnedScan);
    var secondaryIpAddresses = secondaryIpMatch.groups.secondaryIps;
    //console.log(secondaryIpAddresses);
  } else {
    // no secondary IPs found
    var secondaryIpAddresses = "undefined";
  }

  // console.log("primaryIpAddress outside.. " + primaryIpAddress);
  // console.log("secondaryIpAddresses outside "+secondaryIpAddresses);

  // Find rDNS
  // rDNS record for 74.6.143.26: media-router-fp74.prod.media.vip.bf1.yahoo.com
  let rdnsRegex = new RegExp(
    `rDNS record for ${primaryIpAddress}: (?<rdnsRecord>.+)[\\b\\s\\rl\\r]`
  );
  if (rdnsRegex.test(returnedScan)) {
    // rDNS address found
    let rdnsMatch = rdnsRegex.exec(returnedScan);
    var ptrRecord = rdnsMatch.groups.rdnsRecord;
    console.log(ptrRecord);
  } else {
    var ptrRecord = "undefined";
  }

  let mxReturned = await digForMx(domain);
  console.log(mxReturned);

  //  ;; ANSWER SECTION:
  //  unlimitedweb.space.     81755   IN      MX      10 mail.unlimitedweb.space.
  //
  //  ;; Query time: 0 msec

  let mxRegex = new RegExp(`IN\\s+MX\\s+\\d{1,2}\\s+(.+)\\.`, "gi");
  let mxArray;
  let foundMxArray = [];

  mxRegex.lastIndex = 0; // reset the last index
  while ((mxArray = mxRegex.exec(mxReturned)) !== null) {
    let mxRegex2 = new RegExp(
      `IN\\s+MX\\s+\\d{1,2}\\s+(?<mxRecordFound>\\w+\\.\\w+\\.\\w+)\\.`
    );
    let mxRegexMatch2 = mxRegex2.exec(mxArray);
    foundMxArray.push(mxRegexMatch2.groups.mxRecordFound);
  }
  if (foundMxArray == []) {
    foundMxArray = "missing";
  }
  console.log(foundMxArray);

  foundMxArray.forEach(async (mxRecord) => {
    let mailARecord = await pingMx(mxRecord);
    // console.log(mailARecord);
    //PING mx01.ionos.com (74.208.5.21) 56(84) bytes of data.
    let pingMxRegex = new RegExp(
      `PING\\s${mxRecord}\\s\\((?<mxIpFound>\\d{1,4}\\.\\d{1,4}\\.\\d{1,4}\\.\\d{1,4})`
    );
    if (pingMxRegex.test(mailARecord)) {
      let matchPingMx = pingMxRegex.exec(mailARecord);
      let foundMxA = matchPingMx.groups.mxIpFound;
      // console.log("found the A for MX " + foundMxA);
    }
    // ping: mx00.ionos.com.org.net.tk: Name or service not known
    let pingMissingRegex = new RegExp("Name or service not known");
    if (pingMissingRegex.test(mailARecord)) {
      foundMissingMx.push(mailARecord);
    }
  });

  let findTxtRecord = await digForTxt(domain);
  // unlimitedweb.space.     86400   IN      TXT     "v=spf1 +a +mx +a:hope.unlimitedweb.space -all"
  let spfRegex = new RegExp(`IN\\s+TXT\\s+"(?<spfRecordFound>v=spf1\\s.+)"`);
  if (spfRegex.test(findTxtRecord)) {
    let spfMatch = spfRegex.exec(findTxtRecord);
    var spfMatchFound = spfMatch.groups.spfRecordFound;
    console.log(spfMatchFound);
  } else {
    console.log("no SPF found:\n" + findTxtRecord);
    var spfMatchFound = "none";
  }

  if (openPortList.indexOf(25) > -1) {
    const nmapHostname = await nmapForHostname(domain);
    console.log(nmapHostname);

    // Service Info: Host:  love.unlimitedweb.space
    let hostnameRegex = new RegExp(
      `Host:\\s+(?<foundHostname>.+)[\\b\\s\\rl\\n]`
    );
    if (hostnameRegex.test(nmapHostname)) {
      let hostnameMatch = hostnameRegex.exec(nmapHostname);
      var serverHostname = hostnameMatch.groups.foundHostname;
      console.log(serverHostname);
    } else {
      var serverHostname = "undefined";
    }
  }

  var detectWordpress = await curlForWordpress(domain);
  //  Location: https://retro.unlimitedweb.space/wp-login.php
  //  location: https://help.unlimitedweb.space/
  let curlRedirectRegex = new RegExp(
    `[Ll]ocation:\\s+(?<redirectLocation>.+)[\\b\\s\\rl\\n]`
  );
  while (curlRedirectRegex.test(detectWordpress)) {
    //console.log("in a while loop");
    //console.log(detectWordpress);
    let newLocationMatch = curlRedirectRegex.exec(detectWordpress);
    let newLocation = newLocationMatch.groups.redirectLocation;
    detectWordpress = await curlForWordpress(newLocation);
  }
  //console.log("out of while loop");
  //console.log(detectWordpress);

  // HTTP/2 200
  // server: nginx
  // date: Thu, 19 Oct 2023 18:11:28 GMT
  // content-type: text/html; charset=UTF-8
  // x-powered-by: PHP/8.1.24

  let wpLoginRegex = new RegExp(`HTTP/2\\s+200`);
  if (wpLoginRegex.test(detectWordpress)) {
    // WordPress detected
    var wordPress = "detected";
    let phpVersionRegex = new RegExp(
      `PHP/(?<phpVersionDetected>.+)[\\b\\s\\rl\\n]`
    );
    if (phpVersionRegex.test(detectWordpress)) {
      let phpVersionMatch = phpVersionRegex.exec(detectWordpress);
      var phpVersionFound = phpVersionMatch.groups.phpVersionDetected;
      console.log(phpVersionFound);
    } else {
      var phpVersionFound = "undetected";
    }
  } else {
    // WordPress not detected
    var wordPress = "undetected";
    var phpVersionFound = "undetected";
  }

  if (wordPress === "detected") {
    let wordPressVersion;
  }

  return {
    openPorts: openPortList,
    targetPleskName: targetPleskVersionName,
    targetPleskVersion: targetPleskVersionNumber,
    currentPleskName: currentVersionName,
    currentPleskVersion: currentVersionNumber,
    domainMainIp: primaryIpAddress,
    domainSecondaryIps: secondaryIpAddresses,
    reverseDNS: ptrRecord,
    mailServer: foundMxArray,
    mxUnresolved: foundMissingMx,
    spfRecord: spfMatchFound,
    hostName: serverHostname,
    anotherValue: "1",
  };
};
