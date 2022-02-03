const axios = require('axios');
const fs = require('fs');
const slugify = require('slugify')
const ObjectsToCsv = require('objects-to-csv');

let rawdata = fs.readFileSync('all-petshops-slugs.json');
let allSlugs = JSON.parse(rawdata);

function parsePetshopData(data)
{
    const products = []

    for (const key in data.categories[0]) {
        if (Object.hasOwnProperty.call(data.categories[0], key)) {
            const element = data.categories[0][key];  
            const vendor = data.petshop.company; 
            
            if (element.length)
            {
                element.forEach(product => {    
                    products.push({
                        handle: slugify(`${vendor} ${product.title}`, { lower: true }),
                        title: product.title,
                        body_html: product.description,
                        price: product.price,
                        vendor: vendor,
                        image_url: `https://perseu.docgsx.com.br/${product.image_url}`,
                        collection: key
                    });
                });
            }
        }
    }
    return products
}

allSlugs.forEach(async element => { 
    await axios.get(`https://perseu.docgsx.com.br/user/petshops/${element}`, {
        headers: {
            ['access-token']: 'gXMjLXvKtat0inaLj2yREg',
            ['client']: '-DmGE_hCOwrvMeuPVWFXKA',
            ['uid']: 'italoaurelior@gmail.com',
        }
    })
    .then(response => {
        if (response.data.address){
            const petshopData = {
                id: response.data.petshop.id,
                petshop: response.data.petshop.company,
                address: response.data.address,
            }
            fs.appendFile(`./locations/all-petshops-address.json`, JSON.stringify(petshopData), function (err) {
                if (err) throw err;
                console.log(`Saved! ${response.data.petshop.company} address`);
              });
        }
        if(response.data.categories.length > 0)
        {
            const products = parsePetshopData(response.data);
            if (products.length)
            {
                  (async () => {
                    const csv = new ObjectsToCsv(products);
                  
                    // Save to file:
                    await csv.toDisk(`./products/${slugify(response.data.petshop.company, {})}-products.csv`);
                  
                    // Return the CSV file as string:
                    console.log(await csv.toString());
                  })();
            }
        }            
    })
    .catch(error => {
        // console.log(error);
    });
})
