const axios = require("axios");
const cheerio = require("cheerio");

async function scraperYahooFinance(url) {
    console.log('cheers');
    const html = await axios.get(url);
    const cheerio = require('cheerio');
    const $ = cheerio.load(html.data);
    const results = [];

    const tableRows = $('table tbody tr');
    tableRows.each((index, row) => {

        const result = {};
        const tds = $(row).find('td');
        tds.each((index, td) => {
                // use aria label as key
                const key = $(td).attr('aria-label');
                // use inner text as value
            result[key] = $(td).text();
            }
        );
        results.push(result);
    });
    console.log(results);
    return results;
}

// const url = 'https://finance.yahoo.com/gainers/';
// scraperYahooFinance(url).then((results) => {
//     console.log(results);
// });

module.exports = {
    scraperYahooFinance,
}