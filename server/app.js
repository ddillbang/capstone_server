var express = require('express');
var app = express();
var ejs = require('ejs');
var session = require('express-session'); //session module;
var MysqlStore = require('express-mysql-session')(session);
const db = require('./db');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// const http = require('http');
// const socket = require('socket.io');
// const server = http.createServer(app);
// const io = socket(server);

//var server = require('http').createServer(app);
//var io = require('socket.io')(server);

// load consumer.js and pass it the socket.io object
// require('./router/chat.js')(io);

const home = require('./router/home.js'); 
const search = require('./router/search.js'); 
const login = require('./router/login.js'); 
const board = require('./router/board.js'); 
const detail = require('./router/detail.js'); 
const chat = require('./router/chat.js');

app.use(session({
    secret: '1234@', //it can be same as cookie setting
    resave: false,
    saveUninitialized: true,
    store: new MysqlStore(db.d)
}));

app.use(home);
app.use(search);
app.use(login);
app.use(board);
app.use(detail);
app.use('/static', express.static(__dirname + '/public'))
app.use(chat);


app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('html', ejs.renderFile);


io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
    // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
    
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

server.listen(3000, function()
{
    console.log("서버가동");
})

