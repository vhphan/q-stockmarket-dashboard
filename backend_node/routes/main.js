// a basic Express router

const express = require('express');
const router = express.Router();
const controller = require('#src/controllers/main');
const apiCache = require('apicache-plus');
// router.use(apiCache('5 minutes'));


router.use(controller.devModeStaticApi);

router.get('/', controller.index);

router.get('/getBars', controller.getBars);
router.get('/getMarketNews', controller.getMarketNews);
router.get('/getMajorIndexes', controller.getMajorIndexes);

router.get('/getTopGainers', controller.getTopGainers);
router.get('/getDailyTrendMultiSymbols', controller.getDailyTrendMultiSymbols);

module.exports = router;