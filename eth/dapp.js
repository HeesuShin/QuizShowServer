var fs = require("fs");
var async = require('async');
var tx = require('ethereumjs-tx');
var content = fs.readFileSync("./config.json");
const QuizInformation = require('../models').QuizInformation;
var scheduler = require('../scheduler');
var config = JSON.parse(content);
var contract = JSON.parse(fs.readFileSync("./build/contracts/QuizShowToken.json"));
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.eth.url));
var admin = config.admin;
var adminPK = Buffer.from(config.adminPK, 'hex');
var quizContract = new web3.eth.Contract(contract.abi, config.contract.quiz);

// 퀴즈게임 접수 : 일시 20190312120000, 상품 QC, 상금 1000000000, 상태 0)
//   state  상태 : 0 - 대기, 1 - 게임시작, 2-게임종료, 3- 정산종료
// ------------------------------------------------------------------------
exports.reserveQuizShow = function (request, callback) {
   
    var contractFunction = quizContract.methods.reserveQuiz(request.datetime, request.prizeKind, parseInt(request.amount));
    var functionABI = contractFunction.encodeABI();

    web3.eth.getTransactionCount(admin).then(_nonce => {
        nonce = _nonce.toString(16);
    
        console.log("Nonce: " + nonce);
        var transactionObj = {
            nonce: '0x' + nonce,
            from: admin,
            to: '0xf9da1791376e03da8cf6636aa65cfb72dc77169b',
            value: 0,
            data: functionABI,
            gasLimit: 2100000,
            gasPrice: 2000000000
        }
        const transaction = new tx(transactionObj);
        transaction.sign(adminPK);
    
        const serializedTx = transaction.serialize();
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
            console.log('RESULT!!!!');
            console.log(receipt);
            var date = request.datetime;
            var year = date.substring(0, 4);
            var month = date.substring(4, 6);
            var day = date.substring(6, 8);
            var hour = date.substring(8, 10);
            var min = date.substring(10, 12);
            var sec = date.substring(12, 14);
            var dDate = new Date(year, month - 1, day, hour, min, sec);

            QuizInformation.create({
                startDate: dDate,
                rewardAmount: request.amount,
                rewardToken: request.prizeKind
            })
            scheduler.addSchedule(request.datetime, request.prizeKind, request.amount);
            return callback(null);
        })
        .on('error', console.error); 

    });
}

exports.getQuizShowList = async function(finalCallback) {
    let indexs = [];

    try {
        const showList = await QuizInformation.findAll({});
        for ( var i = 0; i < showList.length; i++ ) {
            indexs.push(i);
        }
        async.map(indexs,
            function (id, callback) {
                quizContract.methods.getQuizList(id).call({}, function (err, res) {
                    callback(null, {
                        datetime: res.datetime,
                        prizeKind: res.prize_kind,
                        amount: res.prize_amount
                    });
                });
            }, function (err, result) {
                return finalCallback(null, result);
            }
        )
    } catch (e) {
        console.log(e);
    }
}

exports.quizContract = quizContract;