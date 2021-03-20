/**
 * Format a list of events objects into 2D array / tabular format
 */
function to2DArray(events) {
  events = dedupe(events);
  let tags = getAllTags(events);

  result = [];
  result.push(tags);
  events.forEach(event => {
    let currRow = [];
    for (let i = 0; i < tags.length; i++) {
      const currTag = tags[i];
      currRow.push((currTag in event) ? event[currTag] : "");
    }
    result.push(currRow);
  });

  return result;
}

/**
 * Format a list of events objects into csv format
 */
function toCsvString(events) {
  events = dedupe(events);
  let tags = getAllTags(events);

  let csvString = "";
  csvString += tags.join(",") + "\n";
  events.forEach(event => {
    let currLine = "";
    for (let i = 0; i < tags.length; i++) {
      const currTag = tags[i];
      currLine += (currTag in event) ? event[currTag] : "";
      if (i != tags.length - 1) currLine += ","
    }
    csvString += currLine + "\n";
  });

  return csvString;
}

function getAllTags(events) {
  const distinctTags = new Set();
  events.forEach(event => {
    Object.keys(event).forEach(key =>
      distinctTags.add(key)
    )
  })
  return [...distinctTags];
}

function dedupe(events) {
  let seen = new Set();
  let result = [];
  for (let i = 1; i < events.length; i++) {
    let event = events[i]["Analytics event"];
    if (!seen.has(event)) {
      seen.add(event);
      result.push(events[i]);
    }
  }
  return result;
}


module.exports = {
  to2DArray: to2DArray,
  toCsvString: toCsvString,
};