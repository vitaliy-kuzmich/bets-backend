var config = {};
const args = process.argv;
let env = args[args.length - 1];
if (env === 'prod') {
/*    config.contractAddress = '0xdec3fe06325381c5c62fcdd48b5273f43a971a90';
    config.txDelay = 15000;
    config.txRepeatDelay = 5000;
    config.txRepeatLimit = 5;
    config.privateKey = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
    config.web3Host = 'http://localhost:8545';
    config.gasLimit = 6712390;
    config.port = 3001;
    config.host = 'localhost';
    config.networkId = 1000;*/
} else {
    config.contractAddress = '0x74e37c60e9ff10637f3f60c80186b6673ae71b3e';
    config.txDelay = 1000;
    config.txRepeatDelay = 500;
    config.txRepeatLimit = 5;
    //0x72466d0336a5bd4b4da84b6fcace37678f6c807f
    config.privateKey = 'f4e06ed93236f9eb341e58a059e3343e8e79313ff648db6ec91dbde23358c6c9';
    config.web3Host = 'http://localhost:8545';
    config.gasLimit = 6712390;
    config.port = 3001;
    config.host = 'localhost';
    config.networkId = 1000;
}

module.exports = config;