const { contents } = require('cheerio/lib/api/traversing');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const iosoc = require('express-socket.io-session');
var MysqlStore = require('express-mysql-session')(session);
const db = require('../db');

var user;
//testcode

router.get('/chat', function (req, res){
    if(req.session.user != undefined){ //if sign in successfuelly
        user = req.session.user;
        res.render('chat.html', {id : req.body.uId});
    }
    else {
        res.redirect('/signin');
    }
    
})


router.post('/chat', function (req, res){
    if(req.session.user != undefined){ //if sign in successfuelly
        user = req.session.user;
        res.render('chat.html', {id : req.body.uId});
    }
    else {
        res.redirect('/signin');
    }
    
})

var io = require('socket.io')(global.server);
io.use(iosoc(session({
    secret: '1234@', //it can be same as cookie setting
    resave: false,
    saveUninitialized: true,
    store: new MysqlStore(db.d)
})));

io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
    // console.log(socket.handshake.session.user.id); //testcode

    socket.on('join', function(){
        socket.join(socket.handshake.session.user.id);
        
        db.query('select c_from, c_content from chat where c_to = ?', [socket.handshake.session.user.id],
        function (error, result){
            if(error){
                console.log(error);
            }
            else if(result[0] == undefined) return;
            for(var contents in result){
                io.to(socket.handshake.session.user.id).emit('message', result[contents].c_from + ' : ' + result[contents].c_content);
            }
        });
    })

    

    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
    socket.on('message', (form) => {
        db.query('insert into chat values(?, ?, now(), ?)', [socket.handshake.session.user.id, form.receiver, form.msg],
            function(error, result){
                if(error){
                    console.log(error);
                }
                // console.log(result);
        });
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + socket.handshake.session.user.id + ' : ' + form.msg);
        console.log(form.receiver);
        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        io.to(socket.handshake.session.user.id).emit('message', socket.handshake.session.user.id + ' : ' + form.msg);
        //if(form.receiver != null){
        io.to(form.receiver).emit('message', socket.handshake.session.user.id + ' : ' + form.msg);
        //}
    });
});

module.exports.router = router;