const auth = require("./auth.js");
const yaml = require('js-yaml')
const {google} = require('googleapis');

/**
 * Driver function to start parsing comments
 */
async function docGen() {
  const OAuthclient = await auth.authorize();
  updateSheet(OAuthclient);
}

/**
 * Populate data into Google sheet
 */
async function updateSheet(auth) {
  const fileContents = fs.readFileSync('config/config.yaml');
  const config = yaml.load(fileContents);

  const sheets = google.sheets({version: 'v4', auth});
  const sheetOptions = {spreadsheetId: config["spread sheet id"], range: "Class Data!A2:E"};
  const sheetData = await sheets.spreadsheets.values.get(sheetOptions);
  console.log(sheetData);
}

exports.docGen = docGen;

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
//  function listMajors(auth) {
//     const sheets = google.sheets({version: 'v4', auth});
//     sheets.spreadsheets.values.get({
//       spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//       range: 'Class Data!A2:E',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const rows = res.data.values;
//       if (rows.length) {
//         console.log('Name, Major:');
//         // Print columns A and E, which correspond to indices 0 and 4.
//         rows.map((row) => {
//           console.log(`${row[0]}, ${row[4]}`);
//         });
//       } else {
//         console.log('No data found.');
//       }
//     });
//   }