var math = require('mathjs');

math.config({
    number: 'BigNumber', // Default type of number:
                         // 'number' (default), 'BigNumber', or 'Fraction'
    precision: 32        // Number of significant digits for BigNumbers
});


var log4js = require('log4js');
log4js.configure({
    appenders: {score: {type: 'file', filename: 'score.log'}},
    categories: {default: {appenders: ['score'], level: 'error'}}
});
var logger = log4js.getLogger();

/**
 * score calculator, hardcoded only for two teams
 * @param score
 * @param allowDraw put true in order to allow draw bets calc
 * @constructor
 */
function Score(score, allowDraw, gameId) {
    this.score = score;
    this.draw = score[0] == score[1];
    this.allowDraw = allowDraw;
    this.winTeamIndex = -1;
    this.lostTeamIndex = -1;
    this.teamsCount = math.bignumber(2);
    this.scoreDiff = 0;
    this.scoreDiffPercent = math.bignumber(0);
    this.gameId = gameId;

    if (!this.draw) {
        if (score[0] > score[1]) {
            this.scoreDiff = score[0] - score[1];

            this.winTeamIndex = 0;
            this.lostTeamIndex = 1;
        } else {
            this.scoreDiff = score[1] - score[0];

            this.winTeamIndex = 1;
            this.lostTeamIndex = 0;
        }
        this.scoreDiff = math.bignumber(this.scoreDiff);
        this.scoreDiffPercent = this.scoreDiff.mul(math.bignumber(100)).div(math.bignumber(score[this.winTeamIndex]));
    }

}

/**
 * bets multidimensional array with bets to team, last index is for draw bets, it returns modified bets argument
 * @param bets
 */
Score.prototype.calculate = function (bets) {
    var hundred = math.bignumber(100);
    var totalLostSum = math.bignumber(0);
    if (this.draw && this.allowDraw) {

        for (var i = 0; i < bets.length - 1; i++) {
            for (var j = 0; j < bets[i].length; j++) {
                var toWithdraw = hundred.div(math.bignumber(this.teamsCount)).mul((bets[i][j].amount.div(hundred)));

                bets[i][j].amount = bets[i][j].amount.sub(toWithdraw);
                if (bets[i][j].amount.toString().startsWith("-")) {
                    logger.error("bets calculation issue! value should not be negative after check game id : " + this.gameId)
                }
                totalLostSum = totalLostSum.add(toWithdraw);
            }
        }
        //calc the diff for win team bets
        var totalBetSumOfWinTeam = math.bignumber(0);
        for (var i = 0; i < bets[bets.length - 1].length; i++) {
            totalBetSumOfWinTeam = totalBetSumOfWinTeam.add(bets[bets.length - 1][i].amount);
        }
        for (var i = 0; i < bets[bets.length - 1].length; i++) {
            var diffPercent = bets[bets.length - 1][i].amount.mul(hundred).div(totalBetSumOfWinTeam);
            bets[bets.length - 1][i].amount = bets[bets.length - 1][i].amount.add(diffPercent.mul(totalLostSum).div(hundred));
        }

    } else {
        //withdraw from losers

        for (var i = 0; i < bets[this.lostTeamIndex].length; i++) {
            var toWithdraw = this.scoreDiffPercent.mul(bets[this.lostTeamIndex][i].amount).div(100);
            bets[this.lostTeamIndex][i].amount = bets[this.lostTeamIndex][i].amount.sub(toWithdraw);
            if (bets[this.lostTeamIndex][i].amount.toString().startsWith("-")) {
                logger.error("bets calculation issue! value should not be negative after check game id : " + this.gameId)
            }
            totalLostSum = totalLostSum.add(toWithdraw);
        }
        if (this.allowDraw) {
            for (var i = 0; i < bets[bets.length - 1].length; i++) {
                //  var toWithdraw = 100 / this.teamsCount * bets[bets.length - 1][i].amount / 100;

                var toWithdraw = hundred.div(this.teamsCount).mul(bets[bets.length - 1][i].amount.div(hundred));
                bets[bets.length - 1][i].amount = bets[bets.length - 1][i].amount.sub(toWithdraw);
                if (bets[bets.length - 1][i].amount.toString().startsWith("-")) {
                    logger.error("bets calculation issue! value should not be negative after check game id : " + this.gameId)
                }
                totalLostSum = totalLostSum.add(toWithdraw);
            }
        }


        //calc the diff for win team bets
        var totalBetSumOfWinTeam = math.bignumber(0);
        for (var i = 0; i < bets[this.winTeamIndex].length; i++) {
            totalBetSumOfWinTeam = totalBetSumOfWinTeam.add(bets[this.winTeamIndex][i].amount);
        }

        for (var i = 0; i < bets[this.winTeamIndex].length; i++) {
            var diffPercent = bets[this.winTeamIndex][i].amount.mul(hundred).div(totalBetSumOfWinTeam);
            bets[this.winTeamIndex][i].amount = bets[this.winTeamIndex][i].amount.add(diffPercent.mul(totalLostSum).div(100));
        }
    }
    return bets;


}


module.exports = Score;