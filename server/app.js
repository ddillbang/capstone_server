var express = require('express');
var app = express();
var ejs = require('ejs');
var session = require('express-session'); //session module;
var MysqlStore = require('express-mysql-session')(session);
const db = require('./db');

// const http = require('http');
// const socket = require('socket.io');
// const server = http.createServer(app);
// const io = socket(server);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// load consumer.js and pass it the socket.io object
// require('./router/chat.js')(io);

const home = require('./router/home.js'); 
const search = require('./router/search.js'); 
const login = require('./router/login.js'); 
const board = require('./router/board.js'); 
const detail = require('./router/detail.js'); 
const chat = require('./router/chat.js')(io);

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

app.listen(3000, function()
{
    console.log("서버가동");
})

