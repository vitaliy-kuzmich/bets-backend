var express = require('express');
var router = express.Router();

/* GET bet list listing. */
router.get('/list', function (req, res, next) {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }
    global.sportsBetContract.getBets(
        req.body.gameId
    ).then(gamesArr => {
            return res.json(mapper.parseGame(gamesArr));
        }
    ).catch(err => {
        return res.sendStatus(400);
    });
});

router.get('/count', function (req, res, next) {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }
    global.sportsBetContract.getBetsCount(
        req.body.gameId
    ).then(gamesArr => {
            return res.json(mapper.parseGame(gamesArr));
        }
    ).catch(err => {
        return res.sendStatus(400);
    });
});
router.get('/rate', function (req, res, next) {
    if (!req.body.gameId) {
        return res.sendStatus(400);
    }
    global.sportsBetContract.getBetRate(
        req.body.gameId
    ).then(gamesArr => {
            return res.json(mapper.parseGame(gamesArr));
        }
    ).catch(err => {
        return res.sendStatus(400);
    });
});


module.exports = router;
