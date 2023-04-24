const fs = require("fs");
const util = require('util');
const {logger} = require("#src/middlewares/logger");
const axios = require("axios");
const isDev = process.env.NODE_ENV === 'development';
const marketData = require('#src/controllers/marketData');
const Alpaca = require("@alpacahq/alpaca-trade-api");
const finnhub = require("finnhub");
const {promisify} = require("util");

(function () {
        try {
            logger.info('initializing alpaca/finnhub api');
            const API_KEY = process.env.ALPACA_LIVE_API_KEY;
            const API_SECRET = process.env.ALPACA_LIVE_SECRET;

            // authenticate once
            global.__alpaca = new Alpaca({
                keyId: API_KEY,
                secretKey: API_SECRET,
            });

            const api_key = finnhub.ApiClient.instance.authentications['api_key'];
            api_key.apiKey = process.env.FINNHUB_API_KEY; // Replace this
            global.__finnhubClient = new finnhub.DefaultApi();
            logger.info('Successfully initialized alpaca/finnhub api');
        } catch (e) {
            logger.error(e);
        }
    }
)();


// create a cron job to update alpaca data every 30 minutes
const cron = require('node-cron');
const {updateAlpacaData} = require("#src/controllers/marketData");
const {scraperYahooFinance} = require("#src/controllers/scrapers");

// update alpaca data on startup
updateAlpacaData().then(r => {
});

cron.schedule('*/10 * * * *', () => {
        updateAlpacaData().then(r => {
        });
    }
);

const index = (req, res) => {
    res.json({
        message: 'Welcome to the v1 API',
    });
};

const devModeStaticApi = (req, res, next) => {
    const currentPath = req.url;
    const jsonFileName = currentPath.replace('/', '').replace('?', '_').replaceAll('&', '_') + '.json';
    if (!jsonFileName) next();
    const jsonFile = global.__appDir + '/data/' + jsonFileName;
    logger.info(`checking for ${jsonFile}...`)
    if (fs.existsSync(jsonFile)) {
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        logger.info(`returning data from ${jsonFile}`);
        // res.status(200);
        // res.setHeader('Content-Type', 'application/json');
        return res.json(data);

    }
    next();
};

const getBars = async (req, res) => {
    // timeframe: '1Min' | '5Min' | '15Min' | '1H' | '1D',
    const {symbol, numberOfDays, timeframe} = req.query;
    const data = await marketData.getBars({
        symbol: symbol || 'SPY',
        numberOfDays: numberOfDays || 10,
        timeframe: timeframe || '1Day',
    });
    res.json({
        data,
        success: true,
    });
};


const getMajorIndexes = async (req, res) => {
    const data = await marketData.getMajorIndexes();
    res.json({
        data,
        success: true,
    });
};


const getAssetInfo = async (req, res) => {
    const alpaca = global.__alpaca;
    const symbol = req.query.symbol;
    const data = (await alpaca.getAsset(symbol));
    res.json({
        data,
        success: true,
    })
};

const getActiveAssets = async (req, res) => {
    const alpaca = global.__alpaca;
    const exchange = req.query.exchange || 'NASDAQ';
    logger.info(`getting active assets for exchange ${exchange} from ALPACA API...`)
    const data = (await alpaca.getAssets({status: 'active'})).filter(asset => asset.exchange === exchange).map(asset => {
        return {
            value: asset.symbol,
            label: `${asset.symbol} - ${asset.name}`,
        }
    });
    res.json({
        data,
        success: true,
    })
}

const getBarsMultipleSymbols = async (req, res) => {
    const {symbols, numberOfDays, timeframe} = req.query;
    const data = await marketData.getBarsMultipleSymbols({
        symbols,
        numberOfDays,
        timeframe,
    });
    res.json({
        data,
        success: true,
    });
}

const getBarsMultipleSymbolsDaily = async (req, res) => {
    const {symbols, numberOfDays} = req.query;
    const data = await marketData.getBarsMultipleSymbols({
        symbols,
        numberOfDays,
    });
    res.json({
        data,
        success: true,
    });
};

const getTopGainers = async (req, res) => {
    // scrape yahoo finance for top gainers
    const data = await scraperYahooFinance('https://finance.yahoo.com/gainers');
    res.json({
        data,
        success: true,
    });
};


// const topGainers24Hours = async (req, res) => {
//
//     // use axios to fetch https://api.binance.com/api/v3/ticker/24hr
//     const url = 'https://api.binance.com/api/v3/ticker/24hr';
//     logger.info(`fetching data from ${url}`);
//     const data = (await axios.get(url)).data;
//
//     const sortedData = data.sort((a, b) => {
//             return b["priceChangePercent"] - a["priceChangePercent"];
//         }
//     );
//     res.json({
//         data: sortedData.slice(0, 50),
//         success: true,
//     });
// };

const getMarketNews = async (req, res) => {

    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.marketNews.bind(finnhubClient))('general', {});
    res.json({
        data,
        success: true,
    });

    // finnhubClient.marketNews('general', {}, (error, data, response) => {
    //     if (error) throw error;
    //     res.json({
    //             data,
    //             success: true,
    //         }
    //     );
    // });
};

const getStockSymbols = async (req, res) => {
    const mic = req.query.mic || 'XNAS';
    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.stockSymbols.bind(finnhubClient))('US', {mic});
    res.json({
            data: data.map(d => ({
                symbol: d.symbol,
                description: d.description,
            })),
            success: true,
        }
    );
    // finnhubClient.stockSymbols('US', {mic} ,(error, data, response) => {
    //     if (error) throw error;
    //     res.json({
    //             data: data.map(d => ({
    //                 symbol: d.symbol,
    //                 description: d.description,
    //             })),
    //             success: true,
    //         }
    //     );
    // });
};

const getCompanyProfile = async (req, res) => {
    const symbol = req.query.symbol;
    const finnhubClient = global.__finnhubClient;
    const data = await promisify(finnhubClient.companyProfile2.bind(finnhubClient))({symbol});
    res.json({
            data,
            success: true,
        }
    );
};


module.exports = {
    index,
    devModeStaticApi,
    getBars,
    getBarsMultipleSymbols,
    updateAlpacaData,
    getMajorIndexes,
    getTopGainers,
    getBarsMultipleSymbolsDaily,
    getMarketNews,
    getStockSymbols,
    getCompanyProfile,
    getAssetInfo,
    getActiveAssets,
};