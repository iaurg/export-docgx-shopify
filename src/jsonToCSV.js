const fs = require('fs')
const ObjectsToCsv = require('objects-to-csv');

let rawdata = fs.readFileSync('./products/Dog-Store-Pet-Shop-products.json');
let data = JSON.parse(rawdata);


// If you use "await", code must be inside an asynchronous function:
(async () => {
  const csv = new ObjectsToCsv(data);

  // Save to file:
  await csv.toDisk('./test.csv');

  // Return the CSV file as string:
  console.log(await csv.toString());
})();