var Bet = require('../model/bet');
var math = require('mathjs');
let mapper = {};


mapper.parseGame = function (gamesArr) {
    let rs = [];
    if (gamesArr[0].length > 0) {
        for (let i = 0; i < gamesArr[0].length; i++) {

            let game = {
                gameId: gamesArr[0][i].toString(),
                startDate: gamesArr[1][i].toString(),
                description: mapper.toAscii(gamesArr[2][i])
            };

            rs.push(game);
        }
    }
    return rs;

}
mapper.parseGameDetails = function (details) {
    let rs = {};
    rs.teams = [];
    for (let i = 0; i < details[0].length; i++) {
        rs.teams.push(details[0][i].toString());
    }
    rs.payoutLock = details[1];
    rs.wasRefund = details[2];
    rs.endDate = details[3].toString();
    rs.minBetAmount = details[4].toString();
    rs.allowDrawBets = details[5];
    return rs;

}
/**
 * parse raw data from EVM
 * @param betsArr - data from EVM
 * @param teamIds existing team ids
 * @param isDrawGame
 * @returns {Array} of Bet
 */
mapper.parseBets = function (betsArr, teamIds, isDrawGame) {
    /*   (uint[], address[], uint[]) {
           (betsShiftIndex, bidders, amounts);*/


    let teamBets = []
    let hasDrawBets = false;
    let shiftIndexSum = 0;
    for (let i = 0; i < betsArr[0].length; i++) {
        let currentShift = parseInt(betsArr[0][i].toString());

        let rs = [];
        for (let j = 0; j < currentShift; j++) {
            rs.push(new Bet({
                teamId: teamIds[i],
                address: betsArr[1][j + shiftIndexSum],
                amount: math.bignumber(betsArr[2][j + shiftIndexSum].toString()),
                isDraw: false
            }))
        }
        shiftIndexSum += currentShift;
        teamBets.push(rs);
    }
    if (isDrawGame) {
        let rs = [];
        for (let i = shiftIndexSum; i < betsArr[1].length; i++) {
            rs.push(new Bet({
                teamId: null,
                address: betsArr[1][i],
                amount: math.bignumber(betsArr[2][i].toString()),
                isDraw: true
            }));
        }
        hasDrawBets = rs.length > 0;
        teamBets.push(rs)

    }

    return {
        hasDraw: hasDrawBets,
        bets: teamBets
    };
}
/**
 * call this function to convert bets after calculation
 * @param bets expected that last elements are draw
 * @allowDraw indicate if draw bets allowed
 * @return rs[0] - draw bets, rest team's amount values
 */
mapper.prepareToPayout = function (bets, hasDrawBets) {
    let rs = []
    let teamBets = []
    if (hasDrawBets) {
        let lastDrawIndex = -1;
        for (let i = bets[bets.length - 1].length - 1; i >= 0; i--) {
            lastDrawIndex = i;
            if (!bets[bets.length - 1][i].isDraw) {
                lastDrawIndex -= 1;
            }

        }
        if (lastDrawIndex >= 0)
            rs.push(bets[bets.length - 1]
                .slice(lastDrawIndex, bets.length)
                .map(bet => {
                    return bet.amount;
                }));
    }
    let len = hasDrawBets ? bets.length - 1 : bets.length;
    for (let i = 0; i < len; i++) {
        teamBets = teamBets.concat(bets[i]
            .map(bet => {
                return bet.amount;
            }))
    }
    rs.push(teamBets);


    return rs;

}
mapper.toAscii = function (hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str.replace(/\u0000/g, '');
}


module.exports = mapper;