const fs = require("fs"); 
const rl = require("readline-sync");
const {google} = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = "config/token.json";
const CREDS_PATH = "config/credentials.json"

/**
 * Create an OAuth2 client with creds from CREDS_PATH. Generates 
 * or renew token and stores at TOKEN_PATH.
 */
async function authorize() {
  var credentials;
  try {
    const credsData = await fs.promises.readFile(CREDS_PATH);
    credentials = JSON.parse(credsData);
  } catch (e) {
    return console.log("Error loading client secret file:", e);
  }

  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    const token = await fs.promises.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (e) {
    return await getNewToken(oAuth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const code = rl.question("Enter the code from that page here: ");

  try {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error while trying to retrieve access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      return oAuth2Client;
    });
  } catch (e) {
    console.error("Error while trying to retrieve access token: " + e);
    throw(e)
  }
}

exports.authorize = authorize;