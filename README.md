# XellIX

XellIX is an interactive website and server health checker, maintenance tool, and installer.  The tool is currently in version 1.1.0, and can be accessed at:

https://xellix.unlimitedweb.space/


### Work Log

- November 21, 2023 (1.1.0) : KDE installer is up and running!; Fixed paste bug; Longer timeouts for more reliable scans

- November 13, 2023 (1.0.6) : Bug fix in WordPress lookup; some preliminary work on installer tool

- November 9, 2023 (1.0.5) : Bug fix in hostname lookup; increased timeout for port scan

- November 8, 2023 (1.0.4) : Fixed many bugs by adding timeouts and preventing malformatted queries

- November 6, 2023 (1.0.3) : Fixed PHP output; Fixed bug by adding curl timeout; Added some useful information and linked guides to errors

- November 3, 2023 (1.0.2) : Fixed return error for incorrect queries; fixed Plesk version mismatch bug

- November 2, 2023 (1.0.1) : Fixed SSL date lookup; added tabs to prepare for new features

- **November 1, 2023 (1.0.0) : Updated for production; It's alive!**

- October 30, 2023 : Web client fully functional; will deploy soon

- October 29, 2023 : Fixed MX lookup; web client is functioning

- October 27, 2023 : Added wildcard CORS to server for web client requests; started work on React web client

- October 26, 2023 : Added query sanitization

- October 25, 2023 : Added caching for queries; added GET route for easy querying via browser

- October 23, 2023 : Fetch latest WordPress version; lookup registrar; lookup name servers; resolve SSL expiry date

- October 22, 2023 : Find WordPress installations and version

- October 19, 2023 : Test MX records for associated A record; lookup SPF; lookup hostname

- October 18, 2023 : Added ability to lookup rDNS and MX records

- October 16, 2023 : Fixed function to include correct Plesk subversion; added primary and secondary IPv4/IPv6 captures

- October 13, 2023 : Fixed function to find current Plesk release version