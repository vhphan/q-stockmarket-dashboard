// a basic Express router

const express = require('express');
const router = express.Router();
const controller = require('#src/controllers/main');
const apiCache = require('apicache-plus');
const asyncHandler = require("#src/middlewares/async");
const errorHandler = require("#src/middlewares/error");

// router.use(apiCache('10 minutes'));

const onlyStatus200 = (req, res) => res.statusCode === 200;
const fifteenMinutesCache = apiCache.middleware('15 minutes', onlyStatus200);
const oneHourCache = apiCache.middleware('1 hour', onlyStatus200);
const oneDayCache = apiCache.middleware('1 day', onlyStatus200);

router.use(errorHandler);


router.use(controller.devModeStaticApi);

router.get('/', controller.index);

router.get('/getBars', fifteenMinutesCache, asyncHandler(controller.getBars));
router.get('/getBarsMultipleSymbols', fifteenMinutesCache, asyncHandler(controller.getBarsMultipleSymbols));

router.get('/getMajorIndexes', fifteenMinutesCache, asyncHandler(controller.getMajorIndexes));
router.get('/getTopGainers', fifteenMinutesCache, asyncHandler(controller.getTopGainers));
router.get('/getBarsMultipleSymbolsDaily', fifteenMinutesCache, asyncHandler(controller.getBarsMultipleSymbolsDaily));

router.get('/getMarketNews', fifteenMinutesCache, asyncHandler(controller.getMarketNews));
router.get('/getStockSymbols', fifteenMinutesCache, asyncHandler(controller.getStockSymbols));
router.get('/getCompanyProfile', fifteenMinutesCache, asyncHandler(controller.getCompanyProfile));
router.get('/getAssetInfo', fifteenMinutesCache, asyncHandler(controller.getAssetInfo));
router.get('/getActiveAssets', oneDayCache, asyncHandler(controller.getActiveAssets));

module.exports = router;