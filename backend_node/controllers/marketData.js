const Alpaca = require("@alpacahq/alpaca-trade-api");
const {logger} = require("#src/middlewares/logger");
const moment = require("moment");
const _ = require("lodash");



function getLastNTradingDays(numberOfDays) {
    const clock = global.__clock;
    const tradingDays = global.__calendar;

    if (!clock || !tradingDays) {
        logger.error("clock or tradingDays is not defined");
        updateAlpacaData();
    }

    const i = _.findLastIndex(
        tradingDays,
        (d) => d.date <= moment(clock).format("YYYY-MM-DD")
    );

    return tradingDays.slice(i - (numberOfDays - 1), i + 1);
}

async function getBars({symbol, numberOfDays = 10, timeframe = "1Day"}) {

    const alpaca = global.__alpaca;
    const lastNTradingDays = getLastNTradingDays(numberOfDays);

    const bars = alpaca.getBarsV2(symbol, {
        start: lastNTradingDays.shift().date,
        // end: last10TradingDays.pop().date,
        timeframe: timeframe,
        adjustment: "all",
    });
    return await getDataFromAsyncGenerator(bars);
}

async function getBarsMultipleSymbols({symbols, numberOfDays = 10, timeframe = "1Day"}) {
    const alpaca = global.__alpaca;
    const lastNTradingDays = getLastNTradingDays(numberOfDays);

    const bars = alpaca.getMultiBarsAsyncV2(symbols, {
        start: lastNTradingDays.shift().date,
        // end: last10TradingDays.pop().date,
        timeframe: timeframe,
        adjustment: "all",
    });
    return await getDataFromAsyncGenerator(bars);
}

async function getDataFromAsyncGenerator(generator) {
    const data = [];
    for await (const d of generator) {
        data.push(d);
    }
    return data;
}

async function getMajorIndexes() {
    const alpaca = global.__alpaca;
    // const lastNTradingDays = getLastNTradingDays(5);

    return (await getDataFromAsyncGenerator(await alpaca.getSnapshots(
            // ["SPY", "DIA", "IWM", "VTI", "MDY", "DBC"],
            [
                "SPY",
                "QQQ",
                "IWM",
                "DIA",
                "VTI",
                "MDY",
                "DBC",
                "FEZ",
                "OEF",
                "IWF",
                "IWD",
                "PFF",
                "VOO",
                "IJH",
                "IWO",
                "IWN",
                "ACWI",
                "IEMG",
            ]


        ))
    );
}



const updateAlpacaData = async () => {
    try {
        const alpaca = global.__alpaca;
        logger.info('updating alpaca data');
        global.__clock = await alpaca.getClock();
        global.__calendar = !global.__isDev ? await alpaca.getCalendar() : require('../data/calendar.json');
        logger.info('alpaca data updated');
    } catch (e) {
        logger.error(e);
    }
    // save calendar as JSON file
    // const fs = require('fs');
    // const path = require('path');
    // const filePath = path.join(global.__appDir, 'data/calendar.json');
    // let calendarJson = JSON.stringify(calendar);
    // console.log(calendarJson);
    // fs.writeFile(
    //     filePath,
    //     calendarJson,
    //     function (err) {
    //         if (err) {
    //             console.log("An error occured while writing JSON Object to File.");
    //             return console.log(err);
    //         }
    //         console.log("JSON file has been saved.");
    //     }
    // );
    // save to filepath

};

module.exports = {
    getBars,
    getMajorIndexes,
    updateAlpacaData,
    getBarsMultipleSymbols,
    getDataFromAsyncGenerator
};