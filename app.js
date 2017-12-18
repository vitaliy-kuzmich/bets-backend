const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const sportBetsArtifact = require('./public/SportBets.json');
const Tx = require('ethereumjs-tx')
const config = require('./config');

global.privateKey = Buffer.from(config.privateKey, 'hex')
global.web3 = new Web3(new Web3.providers.HttpProvider(config.web3Host));
global.sportsBetContract = global.web3.eth.contract(sportBetsArtifact.abi).at(config.contractAddress);
global.sendTransaction = (data) => {

    let rs = new Promise((resolve, reject) => {
        global.web3 = new Web3(new Web3.providers.HttpProvider(config.web3Host));
        global.sportsBetContract = global.web3.eth.contract(sportBetsArtifact.abi).at(config.contractAddress);

        global.web3.eth.getTransactionCount(global.web3.eth.coinbase, (err, nonce) => {
            if (err) {
                return reject(err);
            }
            var tx = new Tx({
                nonce: nonce,
                //gasPrice: '0x09184e72a000',
                gasLimit: global.web3.toHex(config.gasLimit),
                to: global.sportsBetContract.address,
                value: '0x00',
                data: data,
                chainId: config.networkId
            });
            tx.sign(global.privateKey);
            var serializedTx = tx.serialize();

            global.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'),
                function (err1, hash) {
                    if (err1) {
                        return reject(err1);
                    } else {
                        let counter = 0;
                        let checkTx = function () {
                            let tx = global.web3.eth.getTransaction(hash);
                            if (!tx.blockNumber) {
                                counter++;
                                if (counter < config.txRepeatLimit) {
                                    setTimeout(checkTx, config.txRepeatDelay);
                                } else {
                                    reject({
                                        tx: hash,
                                        message: "transaction timeout, it is not mean that transaction failed, maybe network overloaded."
                                    })
                                }
                            } else {
                                return resolve(tx);
                            }
                        }

                        setTimeout(checkTx, config.txDelay)
                    }
                })
        })

    });
    return rs;
}

var game = require('./routes/games')
var bets = require('./routes/bets')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bets', bets)
app.use('/games', game);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(config.port, config.host);

module.exports = app;
