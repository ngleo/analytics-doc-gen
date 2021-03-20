const auth = require("./auth.js");
const format = require("./format.js");
const parser = require("./parser.js");
const gsheet = require("./gsheet.js");
const yaml = require("js-yaml")

/**
 * Parse directory and upload analytics events documentation to Google Sheet 
 */
async function docGenAndUpload() {
  try {
    const authClient = await auth.authorize();
    
    const result = await parser.parseDir();
    const values = format.to2DArray(result);
    await gsheet.clearSheet(authClient);
    await gsheet.updateSheet(authClient, values);
  } catch (e) {
    console.error(e);
    // return console.error("Failed to authenticate");    
  }
}

/**
 * Parse directory and produce a csv documenting the events 
 */
 async function docGenToCsv() {
  try {
    const result = await parser.parseDir();
    const csvString = format.toCsvString(result);

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

module.exports = {
  docGenAndUpload: docGenAndUpload,
  docGenToCsv: docGenToCsv,
};