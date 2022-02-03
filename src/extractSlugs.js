const fs = require('fs');

let rawdata = fs.readFileSync('all-pets.json');
let allPetshops = JSON.parse(rawdata);
const mapSlugs = allPetshops.data.map(petshop => petshop.slug);

fs.writeFile('all-petshops-slugs.json', JSON.stringify(mapSlugs), function (err) {
    if (err) return console.log(err);
    console.log('Finished Write!');
});
