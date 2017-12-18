var express = require('express');
var router = express.Router();
var Score = require('../model/score')
var Bet = require('../model/score')
var mapper = require('../util/mapper')

router.get('/iterate', function (req, res, next) {
    //uint _startIndex, bytes32 _filterSportType, uint _filterStartDateBefore, bool _allowDraw
    global.sportsBetContract.iterateGames(
        req.body.startIndex,
        req.body.sportType,
        req.body.beforeDate,
        req.body.allowDraw,
    ).then(gamesArr => {
            return res.json(mapper.parseGame(gamesArr));
        }
    ).catch(err => {
        return res.sendStatus(400);
    });

})


router.get('/details', function (req, res, next) {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }
    global.sportsBetContract.getGameDetails(req.body.gameId).then(details => {
        return res.json(mapper.parseGameDetails(details));
    }).catch(err => {
        return res.status(400).json(err);
    })


})
router.post('/payout', function (req, res, next) {
    // uint _gameId, uint[] _drawBetToPayouts, uint[] _teamIdsLimits, uint[] _payoutAmount
    try {

        let details = global.sportsBetContract.getGameDetails(req.body.gameId);
        let betsArrs = global.sportsBetContract.getBets(req.body.gameId);
        let allowDraw = details[5];
        let parsedBetsObj = mapper.parseBets(betsArrs, details[0], allowDraw);
        let scoreModel = new Score(req.body.score, allowDraw, req.body.gameId);
        let bets = scoreModel.calculate(parsedBetsObj.bets);
        bets = mapper.prepareToPayout(bets, parsedBetsObj.hasDraw);
        let drawBets = parsedBetsObj.hasDraw ? bets[0] : [];
        let teamBets = parsedBetsObj.hasDraw ? bets[1] : bets[0];
        //uint _gameId, uint[] _drawBetToPayouts, uint[] _teamIdsLimits, uint[] _payoutAmount
        let data = global.sportsBetContract.payout.getData(req.body.gameId, drawBets, teamBets);

        global.sendTransaction(data).then(tx => {
            res.status(200).json(tx);
        }).catch(err => {
            res.status(404).json(JSON.stringify(err))
        })
    } catch (err) {
        res.status(404).json(JSON.stringify(err))
    }


});

router.post('/refund', function (req, res, next) {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }

    let data = global.sportsBetContract.refund.getData(req.body.gameId);

    global.sendTransaction(data).then(tx => {
        res.status(200).json(tx);
    }).catch(err => {
        res.status(404).json(JSON.stringify(err))
    })

});

router.delete('/', async (req, res, next) => {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }

    let data = global.sportsBetContract.deleteGame.getData(req.body.gameId);

    global.sendTransaction(data).then(tx => {
        res.status(200).json(tx);
    }).catch(err => {
        res.status(404).json(JSON.stringify(err))
    })
});

router.get('/count', async (req, res, next) => {

    let len = await global.sportsBetContract.getGamesLen();
    res.json(len.toString())
});
router.post('/add', function (req, res, next) {
    if (!req.body.game || !req.body.game.gameId) {
        return res.sendStatus(400);
    }

    let data = global.sportsBetContract.addGame.getData(
        req.body.game.sportType,
        req.body.game.teamIds,
        req.body.game.startDate,
        req.body.game.endDate,
        req.body.game.allowDraw,
        req.body.game.minBetAmount,
        req.body.game.description,
        req.body.game.gameId);

    global.sendTransaction(data).then(tx => {
        res.status(200).json(tx);
    }).catch(err => {
        res.status(404).json(JSON.stringify(err))
    })

})


module.exports = router;
