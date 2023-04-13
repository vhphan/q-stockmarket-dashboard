const Alpaca = require("@alpacahq/alpaca-trade-api");
const {logger} = require("#src/middlewares/logger");
const API_KEY = process.env.ALPACA_LIVE_API_KEY;
const API_SECRET = process.env.ALPACA_LIVE_SECRET;


class DataStream {
    constructor({feed = 'iex', barsAssets = ["SPY"]}) {
        this.alpaca = new Alpaca({
            keyId: API_KEY,
            secretKey: API_SECRET,
            feed,
        });

        const apcSocket = this.alpaca.data_stream_v2;

        apcSocket.onConnect(function () {
            console.log("Connected");
            apcSocket.subscribeForQuotes(["AAPL"]);
            // socket.subscribeForTrades(["FB"]);
            logger.info(`barsAssets = ${barsAssets}`)
            apcSocket.subscribeForBars(barsAssets);
            apcSocket.subscribeForStatuses(["*"]);
        });


        apcSocket.onError((err) => {
            console.log(err);
        });

        apcSocket.onStockTrade((trade) => {
            console.log(trade);
        });

        apcSocket.onStockQuote((quote) => {
            console.log(quote);
        });

        apcSocket.onStockBar((bar) => {
            console.log(bar);
        });

        apcSocket.onStatuses((s) => {
            console.log(s);
        });

        apcSocket.onStateChange((state) => {
            console.log(state);
        });



        apcSocket.onDisconnect(() => {
            console.log("Disconnected");
        });

        apcSocket.connect();

        // unsubscribe from FB after a second
        // setTimeout(() => {
        //     apcSocket.unsubscribeFromTrades(["FB"]);
        // }, 1000);

        this.apcSocket = apcSocket;

    }
}

// let stream = new DataStream({
//     apiKey: API_KEY,
//     secretKey: API_SECRET,
//     feed: "sip",
//     paper: true,
// });


const createMySocketServer = (server) => {
    const {Server} = require('socket.io');

    const io = new Server(
        server,
        {
            cors: {
                origin: '*',
            },
            path: '/apcSocket'
        }
    );

    io.on('connection', (socket) => {

        logger.info(`socket id = ${socket.id}`);

        socket.on('sendingMessage', (data) => {
            logger.info(`sending message: ${data}`);
        });

        socket.on('receiveMessage', (data) => {
                logger.info(`received message: ${data}`);
            }
        );

    });
    const sendHeartbeat = () => {
        // io.send(`hello from server. socket id = ${io.id}. The time is ${new Date()}`);
        io.emit('broadcastMessage', `hello from server. The time is ${new Date()}`);
    };

    setInterval(sendHeartbeat, 60 * 1000);

    const apcStream = new DataStream({
        feed: 'iex', barsAssets: ["SPY", "MSFT", "GOOG"]
    });

    apcStream.apcSocket.onStockBar((bar) => {
        io.emit('stockBar', bar);
    });


    return io;

};

module.exports = {
    createMySocketServer
};