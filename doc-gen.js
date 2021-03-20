const auth = require("./auth.js");
const parser = require("./parse.js");
const yaml = require("js-yaml")
const {google} = require("googleapis");

/**
 * Driver function to start parsing comments
 */
async function docGen() {
  try {
    // const authClient = await auth.authorize();
    // console.log(authClient)
    // await updateSheet(authClient);
    const result = await parser.parseDir();
    console.log("done");
  } catch (e) {
    console.error(e);
    // return console.error("Failed to authenticate");    
  }
}

/**
 * Populate data into Google sheet
 */
async function updateSheet(authClient) {
  const fileContents = fs.readFileSync("config/config.yaml");
  const config = yaml.load(fileContents);
  const sheetId = config["spread sheet id"];
  const sheetsService = google.sheets({version: "v4", auth});

  const header = ["Event Name", "Category", "Description"]
  let data = [];
  data.push(header);

  // const request = {
  //   spreadsheetId: sheetId,
  //   range: "Sheet1", 
  //   valueInputOption: "USER_ENTERED",
  //   resource: {data},
  //   // auth: auth,
  // };

  // try {
  //   await sheetsService.spreadsheets.values.update(request);  
  //   console.log("%d cells updated.", result.updatedCells);
  // } catch (e) {
  //   console.log(e);
  // }
  
      sheetsService.spreadsheets.values.get({
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E",
    }, (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log("Name, Major:");
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          console.log(`${row[0]}, ${row[4]}`);
        });
      } else {
        console.log("No data found.");
      }
    });
  // const resource = {
  //   properties: {
  //     title:"a",
  //   },
  // };
  // sheetsService.spreadsheets.create({
  //   resource,
  //   fields: "spreadsheetId",
  // }, (err, spreadsheet) =>{
  //   if (err) {
  //     // Handle error.
  //     console.log(err);
  //   } else {
  //     console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
  //   }
  // });
}

exports.docGen = docGen;

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
//  function listMajors(auth) {
//     const sheets = google.sheets({version: "v4", auth});
//     sheets.spreadsheets.values.get({
//       spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
//       range: "Class Data!A2:E",
//     }, (err, res) => {
//       if (err) return console.log("The API returned an error: " + err);
//       const rows = res.data.values;
//       if (rows.length) {
//         console.log("Name, Major:");
//         // Print columns A and E, which correspond to indices 0 and 4.
//         rows.map((row) => {
//           console.log(`${row[0]}, ${row[4]}`);
//         });
//       } else {
//         console.log("No data found.");
//       }
//     });
//   }