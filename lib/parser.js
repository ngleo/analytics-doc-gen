const fs = require("fs"); 
const yaml = require("js-yaml")
const readline = require("readline")
const path = require('path');

/**
 * Parse all files within root directory
 */
async function parseDir() {
  const fileContents = fs.readFileSync("config/config.yaml");
  const config = yaml.load(fileContents);
  const rootPath = config["root path"];
  const result = [];

  try {
    await walk(rootPath, result);
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function walk(rootPath, resultList) {   
  if ((await fs.promises.stat(rootPath)).isDirectory()) {
    let files = await fs.promises.readdir(rootPath);
    return new Promise(resolve => {
      Promise.all(
        files.map(file => {
          let childPath = path.join(rootPath, file);
          return walk(childPath, resultList);   
        })
      ).then(_ => {
        resolve("parsed dir");
      })
    });
  } else {
    return new Promise(resolve => {
      parseFile(rootPath).then(
        (res) => {
          console.log(res);
          console.log("Finish parsing file: " + rootPath + "\n-----------");          
          resultList.push(...res);
          resolve("parsed file");
        }
      );
    })
  }
}

function parseFile(path) {
  return new Promise(async resolve => {
    const ANALYTICS_TAG = "@Analytics_event";
    const CATEGORY_TAG = "@Category";
    const DESCRIPTION_TAG = "@Description";
    const res = [];

    const readInterface = readline.createInterface({
      input: fs.createReadStream(path),
    });

    let inEventBlock = false;

    let currTag = "";
    let currVal = "";
    let currEvent = {};

    for await (const line of readInterface) {
      if (!inEventBlock) {
        if (line.includes(ANALYTICS_TAG)) {
          // start of an event comment block
          inEventBlock = true;
          currTag = getTagName(ANALYTICS_TAG);
          currVal = getLineContent(line, ANALYTICS_TAG);    
        } 
      } else {
        // still in an event comment block
        if (line.trim().startsWith("///") && line.trim().replace("///", "") !== "") {
          if (!line.includes("@")) {
            currVal += " ";
            currVal += line.replace("///", "").trim();          
          } else if (line.includes(ANALYTICS_TAG)) {
            currEvent[currTag] = currVal; 
            res.push(currEvent);
            currEvent = {};   

            currTag = getTagName(ANALYTICS_TAG);
            currVal = getLineContent(line, ANALYTICS_TAG);
          } else {
            currEvent[currTag] = currVal;
            if (line.includes(CATEGORY_TAG)) {
              currTag = getTagName(CATEGORY_TAG);
              currVal = getLineContent(line, CATEGORY_TAG);
            } else if (line.includes(DESCRIPTION_TAG)) {
              currTag = getTagName(DESCRIPTION_TAG);
              currVal = getLineContent(line, DESCRIPTION_TAG);
            } else {
              throw("Tag not identified");
            }       
          }
        } else {
          // End of an event comment block
          currEvent[currTag] = currVal;
          res.push(currEvent);        
          currEvent = {};

          inEventBlock = false;      
        }
      }
    }

    if (Object.keys(currEvent).length !== 0) {
      currEvent[currTag] = currVal;
      res.push(currEvent);
      currEvent = {};
    }
    readInterface.close();
    resolve(res);
  });
}

function getTagName(tag) {
  return tag.replace("@", "").replace("_", " ");
}

function getLineContent(line, tag) {
  return line.trim().split(tag + " ")[1];
}

exports.parseDir = parseDir;