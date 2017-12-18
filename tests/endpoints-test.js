var request = require("supertest");
var assert = require("assert");
var app = require("../app");
var config = require('../config')
describe('test ends', function () {
    /*  it("should add game", function (done) {
        done();
        request(app)
            .post("/game/add")
            .send({
                game: {
                    sportType: "football",
                    teamIds: [3, 2],
                    startDate: new Date().getTime() / 1000,
                    endDate: new Date().getTime() / 1000 + 5,
                    allowDraw: true,
                    minBetAmount: 100,
                    description: "blablah",
                    gameId: 100510
                }
            }).expect(200).end(done);

    }),
      it("should return games len", function (done) {
            request(app)
                .get("/game/length")
                .expect(function (response1) {
                    assert.deepEqual(response1.body, "1");
                })
                .end(done);
        }),*/
    it("send payout", function (done) {
        let instance = global.sportsBetContract;
        let gameId = 333;
        /*instance.addGame.sendTransaction('football', [1, 2], (new Date().getTime() / 1000) - 1000, (new Date().getTime() / 1000) - 800, true, 100, "game location descr", gameId, {
            from: global.web3.eth.accounts[0],
            gasLimit: config.gasLimit,
            gas: config.gasLimit
        });

  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[1],
      value: global.web3.toWei(10, 'ether')
  })
  let tx523 = instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[2],
      value: global.web3.toWei(5.23, 'ether')
  })
  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[3],
      value: global.web3.toWei(9.54, 'ether')
  })
  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[2],
      value: global.web3.toWei(7.44, 'ether')
  })
  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[3],
      value: global.web3.toWei(2, 'ether')
  })
  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[2],
      value: global.web3.toWei(22, 'ether')
  })
  instance.bet.sendTransaction(gameId, 1, false, {
      from: global.web3.eth.accounts[3],
      value: global.web3.toWei(3, 'ether')
  })

  instance.bet.sendTransaction(gameId, 2, false, {
      from: global.web3.eth.accounts[4],
      value: global.web3.toWei(4, 'ether')
  })
  instance.bet.sendTransaction(gameId, 2, false, {
      from: global.web3.eth.accounts[5],
      value: global.web3.toWei(9, 'ether')
  })
  instance.bet.sendTransaction(gameId, 2, false, {
      from: global.web3.eth.accounts[6],
      value: global.web3.toWei(2, 'ether')
  })
  instance.bet.sendTransaction(gameId, 2, false, {
      from: global.web3.eth.accounts[7],
      value: global.web3.toWei(7, 'ether')
  })
  instance.bet.sendTransaction(gameId, 2, false, {
      from: global.web3.eth.accounts[4],
      value: global.web3.toWei(22, 'ether')
  })

  instance.bet.sendTransaction(gameId, 0, true, {
      from: global.web3.eth.accounts[4],
      value: global.web3.toWei(11, 'ether')
  })
  instance.bet.sendTransaction(gameId, 0, true, {
      from: global.web3.eth.accounts[5],
      value: global.web3.toWei(22, 'ether')
  })
  instance.bet.sendTransaction(gameId, 0, true, {
      from: global.web3.eth.accounts[6],
      value: global.web3.toWei(3, 'ether')
  })*/

        request(app)
            .post("/game/payout")
            .send({
                gameId: gameId,
                score: [90, 121]
            })
            .expect(rs => {
                let txrs = global.web3.eth.getTransaction(tx523);
                console.dir(txrs)

            })
            .end(done);
    })
})