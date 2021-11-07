const session = require('express-session');
const iosoc = require('express-socket.io-session');
var MysqlStore = require('express-mysql-session')(session);
const db = require('../db');

module.exports = function(server){
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
        
        // db.query('select data from sessions where session_id = ?', [], function(err, result){
            
        // })

        //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
        socket.emit('usercount', io.engine.clientsCount);

        // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
        socket.on('message', (msg) => {
            //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
            console.log('Message received: ' + msg);

            // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
            io.emit('message', msg);
        });
    });
    return io;
}