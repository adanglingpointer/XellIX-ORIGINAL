// ------------ //
/* = Requires = */
// ------------ //

const axios = require("axios");
const { exec, execSync } = require("child_process");
const { promisify } = require("util");
const express = require("express");
const bodyParser = require("body-parser");
const { stdout, stderr } = require("process");
const app = express();

const fs = require('fs');



// ------------------------ //
/* = Setup Express Server = */
// ------------------------ //

app.use(bodyParser.urlencoded({ extended: true }));

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


// --------------------------- //
/* = Program Scope Variables = */
// --------------------------- //

let targetPleskVersionName;
let targetPleskVersionNumber;
var currentVersionName = "undefined";
var currentVersionNumber = "undefined";
var foundMissingMx = [];

// ----------------------------------- //
/* = Check for cached target results = */
// ----------------------------------- //

const checkForCachedResults = async (domain, results) => {

const path = `/scans/${domain}`;

// Check if file exists
fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
        console.log('File does not exist. Creating file...');
        fs.writeFile(path, results, (err) => {
            if (err) throw err;
            console.log('File saved!');
        });
    } else {
        console.log('File exists. Reading file...');
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            console.log('File contents:', data);
        });
    }
});
}

// ------------ //
/* = Scanners = */
// ------------ //

//  Scan all ports with nmap.  -F for faster scanning.  -sS to touch lightly.
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

//  If Plesk is detected, we will traceroute and find version.
const pleskScan = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      //      `nmap -A -p 8443 ${domain}`
      // `nmap -sC -sS --traceroute -F ${domain}`
      `nmap -sC -sS -p 8443 ${domain}`
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

//  Lookup most recent release version for Plesk
const pleskVersionMatchFunction = async () => {
  return axios
    .get("https://docs.plesk.com/release-notes/obsidian/change-log/")
    .then(async (response) => {
      let pleskReleaseRegex = new RegExp(
        `changelog-entry__title"\>Plesk (?<versionName>\\w+) (?<versionNumber>\\d{1,3}[.]\\d{1,3}[.]\\d{1,3})`
      );
      let currentVersionMatch = await pleskReleaseRegex.exec(response.data);

      currentVersionName = currentVersionMatch.groups.versionName;
      currentVersionNumber = currentVersionMatch.groups.versionNumber;

      return [currentVersionName, currentVersionNumber];
    })
    .catch((error) => {
      console.error(error);
    });
};

//  Lookup domain's MX records
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

//  Resolve MX records to IP
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

//  Lookup SPF record
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

//  Lookup hostname
const hostScanForName = async (targetIp) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      `host ${targetIp}`
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
}

//  Detect if WordPress exists & PHP version
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

//  If WordPress is detected, find the version
const fetchWordPressVersion = async (url) => {
  return axios
    .get(url)
    .then(async (response) => {
      let wpVersionRegex = new RegExp(
        `id='login-css' .+login.min.css\\?ver=(?<wpVersionFound>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})`
      );
      let wpVersionMatch = await wpVersionRegex.exec(response.data);
      let wpVersionNumber = wpVersionMatch.groups.wpVersionFound;

      return wpVersionNumber;
    })
    .catch((error) => {
      console.error(error);
    });
};

//  Fetch the latest WordPress release version
const fetchLatestWordPress = async () => {
  return axios
    .get("https://wordpress.org/download/releases/")
    .then(async (response) => {
      let wpLatestVersionRegex = new RegExp(
        `\\<th class="wp-block-wporg-release-tables__cell-version" scope="row"\\>(?<latestWordPressFound>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})\\<`
      );

      let wpLatestVersionMatch = await wpLatestVersionRegex.exec(response.data);
      let wpLatestVersionNumber =
        wpLatestVersionMatch.groups.latestWordPressFound;

      return wpLatestVersionNumber;
    })
    .catch((error) => {
      console.error(error);
    });
};

//  WhoIs lookup
const whoIsLookup = async (domain) => {
  //  Resolve root domain (remove subdomains)
  let withoutSubdomain = domain.split(".").slice(-2).join(".");
  console.log(withoutSubdomain);

  try {
    const { stdout, stderr } = await promisify(exec)(
      `whois ${withoutSubdomain}`
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
}

//  If 443 is open, detect SSL date
const lookupSSL = async (domain) => {
  try {
    const { stdout, stderr } = await promisify(exec)(
      `nmap -sS -sC -p 443 ${domain}`
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
}

// ***************************** //
// ~-=~-=~-=~-=~-=~-=~-=~-=~-=~- // ---------- >
/* Main Domain Scanning Function */
// ~-=~-=~-=~-=~-=~-=~-=~-=~-=~- // ---------- >
// ***************************** //

const scanDomain = async (domain) => {
  let openPortList = [];
  let portsToCheck = [21, 22, 25, 53, 80, 110, 143, 443, 465, 993, 995, 1433, 3306, 3389, 5432, 8443, 8447];

  //  Scan the domain via nmap function
  let returnedScan = await scanPorts(domain);
  let pleskRegex = new RegExp("8443/tcp\\s+open");

  for (const port of portsToCheck) {
    let testingPortRegex = new RegExp(`${port}\/tcp\\s+open`);
    if (testingPortRegex.test(returnedScan)) {
      openPortList.push(port);
    }
  }

  // Find out target's version of Plesk if port 8443 returned open
  if (pleskRegex.test(returnedScan)) {
    let pleskCheck = await pleskScan(domain);
    let pleskVersionRegex = new RegExp(
      `(?:http-title:\\sPlesk\\s)(?<versionName>\\w+)\\s(?<versionNumber>\\d{1,3}[.]\\d{1,3}[.]\\d{1,3})`
    );
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
    } else {
      //  Port 8443 is open, but we can't find Plesk version used
      targetPleskVersionName = "unknown";
      targetPleskVersionNumber = "unknown";
    }
  } else {
    // Plesk port not open
    targetPleskVersionName = "undetected";
    targetPleskVersionNumber = "undetected";
  }

  //  Match domain's IP addresses from nmap scan
  let ipMatchingRegex = new RegExp(
    `Nmap scan report for ${domain} \\((?<ipAddress>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})\\)`
  );
  if (ipMatchingRegex.test(returnedScan)) {
    // we've found an IPv4
    let ipMatch = ipMatchingRegex.exec(returnedScan);
    var primaryIpAddress = ipMatch.groups.ipAddress;
  } else {
    // no IPv4 found (host is down)
    var primaryIpAddress = "undefined";
  }
  // Capture all alternative IPv4s and IPv6s within one concatenated string
  let secondaryIpMatchingRegex = new RegExp(
    `Other addresses for ${domain} \\(not scanned\\): (?<secondaryIps>.+\\b)`
  );
  if (secondaryIpMatchingRegex.test(returnedScan)) {
    // found secondary IPs
    let secondaryIpMatch = secondaryIpMatchingRegex.exec(returnedScan);
    var secondaryIpAddresses = secondaryIpMatch.groups.secondaryIps;
  } else {
    // no secondary IPs found
    var secondaryIpAddresses = "undefined";
  }

  // Find rDNS
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

  //  Use a dig command to find MX records
  let mxReturned = await digForMx(domain);
  console.log(mxReturned);
  let mxRegex = new RegExp(`IN\\s+MX\\s+\\d{1,2}\\s+(.+)\\.`, "gi");
  let mxArray;
  let foundMxArray = [];

  mxRegex.lastIndex = 0; // reset the last index
  //  Add each MX record to an array
  while ((mxArray = mxRegex.exec(mxReturned)) !== null) {
    let mxRegex2 = new RegExp(
      `IN\\s+MX\\s+\\d{1,2}\\s+(?<mxRecordFound>\\w+\\.\\w+\\.\\w+)\\.`
    );
    let mxRegexMatch2 = mxRegex2.exec(mxArray);
    foundMxArray.push(mxRegexMatch2.groups.mxRecordFound);
  }
  if (foundMxArray == []) {
    //  No MX records found
    foundMxArray = "missing";
  }

  //  Lookup IP address for each MX record
  foundMxArray.forEach(async (mxRecord) => {
    let mailARecord = await pingMx(mxRecord);
    let pingMxRegex = new RegExp(
      `PING\\s${mxRecord}\\s\\((?<mxIpFound>\\d{1,4}\\.\\d{1,4}\\.\\d{1,4}\\.\\d{1,4})`
    );
    if (pingMxRegex.test(mailARecord)) {
      //  MX record resolved to server, not doing anything with this yet
      //let matchPingMx = pingMxRegex.exec(mailARecord);
      //let foundMxA = matchPingMx.groups.mxIpFound;
      // console.log("found the A for MX " + foundMxA);
    }
    let pingMissingRegex = new RegExp("Name or service not known");
    if (pingMissingRegex.test(mailARecord)) {
      //  Add each invalid MX record to an array
      foundMissingMx.push(mailARecord);
    }
  });

  //  Lookup SPF record
  let findTxtRecord = await digForTxt(domain);
  let spfRegex = new RegExp(`IN\\s+TXT\\s+"(?<spfRecordFound>v=spf1\\s.+)"`);
  if (spfRegex.test(findTxtRecord)) {
    //  Found SPF record
    let spfMatch = spfRegex.exec(findTxtRecord);
    var spfMatchFound = spfMatch.groups.spfRecordFound;
  } else {
    //  No SPF record found
    var spfMatchFound = "missing";
  }

  //  possible function to find mail server HELO response
  /*
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
  */

  var serverHostname;

  //  Lookup hostname
  let hostScanResults = await hostScanForName(primaryIpAddress);
  let hostnameRegex = new RegExp(
    `domain name pointer (?<foundHostname>[\\w\\d\\..]+)\\.`
  );
  if (hostnameRegex.test(hostScanResults)) {
    let hostnameMatch = hostnameRegex.exec(hostScanResults);
    serverHostname = hostnameMatch.groups.foundHostname;

  } else {
    serverHostname = "undetected";
  }
  console.log("server hostname is: " + serverHostname);
  // 83.157.208.74.in-addr.arpa domain name pointer mail.unlimitedweb.space.


  var newLocation;

  var detectWordpress = await curlForWordpress(domain);
  //  Location: https://retro.unlimitedweb.space/wp-login.php
  //  location: https://help.unlimitedweb.space/
  let curlRedirectRegex = new RegExp(
    `[Ll]ocation:\\s+(?<redirectLocation>.+)[\\b\\s\\rl\\n]`
  );
  while (curlRedirectRegex.test(detectWordpress)) {
    //console.log("in a while loop");
    console.log(detectWordpress);
    let newLocationMatch = curlRedirectRegex.exec(detectWordpress);
    newLocation = newLocationMatch.groups.redirectLocation;
    detectWordpress = await curlForWordpress(newLocation);
  }
  //console.log("out of while loop");
  console.log(detectWordpress);

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
    //console.log("looking for WP at " + newLocation);
    var wordPressVersion = await fetchWordPressVersion(newLocation);
    console.log("target WP: " + wordPressVersion);
    var latestWordPress = await fetchLatestWordPress();
    console.log("latest WP: " + latestWordPress);
  } else {
    var wordPressVersion = "undetected";
    var latestWordPress = "undetected";
  }

  //  WhoIs lookup
  var registrarMatch;
  let whoIsLookupResults = await whoIsLookup(domain);
  let whoIsLookupRegex = new RegExp(
    `Registrar URL: (?<registrarFound>.+)[\\r\\n\\rl\\s]+`
  );
  if (whoIsLookupRegex.test(whoIsLookupResults)) {
    let whoIsMatch = whoIsLookupRegex.exec(whoIsLookupResults);
    registrarMatch = whoIsMatch.groups.registrarFound;
    console.log("registrar found: " + registrarMatch);
  } else {
    registrarMatch = "undefined";
  }

  // Tech Email: Please query the RDDS service of the Registrar of Record identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name.
  // Name Server: LOVE.UNLIMITEDWEB.SPACE
  // Name Server: HOPE.UNLIMITEDWEB.SPACE
  // DNSSEC: unsigned


  let nameServerRegex = new RegExp(`Name Server: (?<nameServerFound>.+)[\\r\\n\\rl\\s]+`, "gi");
  let nameServerMatch;
  let nameServerArray = [];

  nameServerRegex.lastIndex = 0;
  while ((nameServerMatch = nameServerRegex.exec(whoIsLookupResults)) !== null) {
    nameServerArray.push(nameServerMatch.groups.nameServerFound);
  }
  console.log(nameServerArray);

  //  Not valid after:  2023-12-24T04:14:05

  //  Lookup SSL date
  var sslExpiryDate;
  var sslIsExpired;
  let sslDateLookup = await lookupSSL(domain);
  let sslDateRegex = new RegExp(`Not valid after:\\s+(?<sslExpiryDateFound>.+)[\\r\\n\\rl\\s]+`);
  if (sslDateRegex.test(sslDateLookup)) {
    let sslDateMatch = sslDateRegex.exec(sslDateLookup);
    sslExpiryDate = sslDateMatch.groups.sslExpiryDateFound;
    console.log("sslExpiryDate is " + sslExpiryDate);

        // Get today's date
        let currentDate = new Date();
        // Compare dates
        if (sslExpiryDate < currentDate) {
          //console.log("SSL certificate has expired.");
          sslIsExpired = "true";
        } else {
          //console.log("SSL certificate is still valid.");
          sslIsExpired = "false"
        }
  } else {
    // couldn't match the SSL date
    sslExpiryDate = "unknown";
    sslIsExpired = "unknown";
  }



  return {
    openPorts: openPortList,
    targetPleskName: targetPleskVersionName,
    targetPleskVersion: targetPleskVersionNumber,
    currentPleskName: currentVersionName,
    currentPleskVersion: currentVersionNumber,
    targetWordPressVersion: wordPressVersion,
    currentWordPressVersion: latestWordPress,
    domainMainIp: primaryIpAddress,
    domainSecondaryIps: secondaryIpAddresses,
    reverseDNS: ptrRecord,
    mailServer: foundMxArray,
    mxUnresolved: foundMissingMx,
    spfRecord: spfMatchFound,
    hostName: serverHostname,
    domainRegistrar: registrarMatch,
    nameServers: nameServerArray,
    sslExpiry: sslExpiryDate,
    sslExpired: sslIsExpired,
    anotherValue: "1",
  };
};
