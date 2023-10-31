# XellIX

XellIX is an interactive website and server health checker, maintenance tool, and installer.  The tool is currently in beta, and can be accessed at:

http://108.175.11.49:3031/{domain}


### Work Log

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