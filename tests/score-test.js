var chai = require('chai');
var Score = require('../model/score');
var Bet = require('../model/bet');
var math = require('mathjs');
var expect = chai.expect; // we are using the "expect" style of Chai

describe('calculation validator', function () {
    it('should test math', function () {
        console.log(math.bignumber(2).sub(math.bignumber(5)).toString())
    })
    it('should validate total payouts', function () {
        //score, allowDraw, gameId
        var score = new Score([90, 121], true, 100501);
        // Bet(isDraw, amount, teamId)
        var bets = score.calculate([
            [new Bet(math.bignumber(10), "0x123", 1, false),
                new Bet(math.bignumber(5.23), "0x123", 1, false),
                new Bet(math.bignumber(9.54), "0x123", 1, false),
                new Bet(math.bignumber(7.44), "0x123", 1, false),
                new Bet(math.bignumber(2), "0x123", 1, false),
                new Bet(math.bignumber(22), "0x123", 1, false),
                new Bet(math.bignumber(3), "0x123", 1, false),
            ], [new Bet(math.bignumber(4), "0x123", 1, false),
                new Bet(math.bignumber(9), "0x123", 1, false),
                new Bet(math.bignumber(2), "0x123", 1, false),
                new Bet(math.bignumber(7), "0x123", 1, false),
                new Bet(math.bignumber(22), "0x123", 1, false),
            ], [new Bet(math.bignumber(11), "0x123", 1, true),
                new Bet(math.bignumber(22), "0x123", 1, true),
                new Bet(math.bignumber(3), "0x123", 1, true),
            ]
        ]);
        expect(bets[0][1].amount.toString()).to.equal("3.8900826446280991735537190082645");
        expect(bets[2][1].amount.toString()).to.equal("11");

    });
    it('should validate total  payouts for draw score', function () {
        //score, allowDraw, gameId
        var score = new Score([90, 90], true, 100502);
        // Bet(isDraw, amount, teamId)
        var bets = score.calculate([
            [new Bet(math.bignumber(10), "0x123", 1, false),
                new Bet(math.bignumber(5.23), "0x123", 1, false),
                new Bet(math.bignumber(9.54), "0x123", 1, false),
                new Bet(math.bignumber(7.44), "0x123", 1, false),
                new Bet(math.bignumber(2), "0x123", 1, false),
                new Bet(math.bignumber(22), "0x123", 1, false),
                new Bet(math.bignumber(3), "0x123", 1, false),
            ], [new Bet(math.bignumber(4), "0x123", 1, false),
                new Bet(math.bignumber(9), "0x123", 1, false),
                new Bet(math.bignumber(2), "0x123", 1, false),
                new Bet(math.bignumber(7), "0x123", 1, false),
            ], [new Bet(math.bignumber(11), "0x123", 1, false),
                new Bet(math.bignumber(22), "0x123", 1, false),
                new Bet(math.bignumber(3), "0x123", 1, false),
            ]
        ]);
        expect(bets[0][0].amount.toString()).to.equal("5");
        expect(bets[2][0].amount.toString()).to.equal("23.407083333333333333333333333334");

    });

})
;