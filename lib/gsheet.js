const yaml = require("js-yaml")
const {google} = require("googleapis");

/**
 * Populate data into Google sheet
 */
async function updateSheet(auth, values) {
  const fileContents = fs.readFileSync("config/config.yaml");
  const config = yaml.load(fileContents);
  const sheetId = config["spreadsheet id"];
  const sheetsService = google.sheets({version: "v4", auth});

  const request = {
    spreadsheetId: sheetId,
    range: "Sheet1", 
    valueInputOption: "USER_ENTERED",
    resource: {"values": values},
  };

  try {
    await sheetsService.spreadsheets.values.update(request);  
    console.log("Cells updated.");
  } catch (e) {
    console.log(e);
  }
}

async function clearSheet(auth) {
  const fileContents = fs.readFileSync("config/config.yaml");
  const config = yaml.load(fileContents);
  const sheetId = config["spreadsheet id"];
  const sheetsService = google.sheets({version: "v4", auth});
  
  try {
    await sheetsService.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: "Sheet1", 
    });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  updateSheet: updateSheet,
  clearSheet: clearSheet,
};