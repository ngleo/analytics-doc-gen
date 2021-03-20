const auth = require("./auth.js");
const parser = require("./parser.js");
const yaml = require("js-yaml")
const {google} = require("googleapis");

/**
 * Driver function to start parsing comments
 */
async function docGenAndUpload() {
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
 * Parse directory and product a csv documenting the events 
 */
 async function docGenToCsv() {
  try {
    const result = await parser.parseDir();
    const distinctTags = new Set();
    result.forEach(event => {
      Object.keys(event).forEach(key =>
        distinctTags.add(key)
      )
    })
    
    let tags = [...distinctTags];
    let csvString = "";
    csvString += tags.join(",") + "\n";
    
    result.forEach(event => {
      let currLine = "";
      for (let i = 0; i < tags.length; i++) {
        const currTag = tags[i];
        currLine += (currTag in event) ? event[currTag] : "";
        if (i != tags.length - 1) currLine += ","
      }
      csvString += currLine + "\n";
    });

    const fileContents = fs.readFileSync("config/config.yaml");
    const config = yaml.load(fileContents);
    const csvOutputPath = config["csv output path"];
    fs.writeFile(csvOutputPath, csvString, (err) => {
      if (err) return console.error(err);
      console.log("Csv stored at: " + csvOutputPath);
    });
  } catch (e) {
    console.error(e);
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

module.exports = {
  docGenAndUpload: docGenAndUpload,
  docGenToCsv: docGenToCsv,
};

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