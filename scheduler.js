var schedule = require('node-schedule');
var FCM = require('fcm-node')

var User = require('./models').User;
var serverKey = require('./quizdapp-firebase-adminsdk-9czhf-721317ac64.json') //put the generated private key path here    
var fcm = new FCM(serverKey);

exports.addSchedule = function (date, kind, prize) {
    var year = date.substring(0, 4);
    var month = date.substring(4, 6);
    var day = date.substring(6, 8);
    var hour = date.substring(8, 10);
    var min = date.substring(10, 12);
    var sec = date.substring(12, 14);
    var date = new Date(year, month - 1, day, hour, min, sec);
    
    schedule.scheduleJob(date, function(){ 
        console.log('퀴즈쇼가 시작됩니다.'); 
        sendMessageToDevice(year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' + min + '분 ', kind, prize);
    });
}

async function sendMessageToDevice(date, kind, prize) {
    try {
        const userList = await User.findAll();
        var tokens = [];
        for ( var i = 0; i < userList.length; i++ ) {
            tokens.push(userList[i].deviceToken);
        }
        console.log(tokens);
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            registration_ids: tokens,
            notification: {
                title: '잠시 후 퀴즈쇼가 시작됩니다!', 
                body: date + "에 총 " + prize + "개의 " + kind + "가 상품입니다."  
            },
        }
        
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!")
            } else {
                console.log("Successfully sent with response: ", response)
            }
        })
    } catch(e) {
        console.log(e);
    }
}