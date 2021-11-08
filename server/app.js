var express = require('express');
var app = express();
var ejs = require('ejs');
var session = require('express-session'); //session module;
var MysqlStore = require('express-mysql-session')(session);
const db = require('./db');

const iosoc = require('express-socket.io-session');

var server = require('http').createServer(app);
global.server = server;

const home = require('./router/home.js'); 
const search = require('./router/search.js'); 
const login = require('./router/login.js'); 
const board = require('./router/board.js'); 
const detail = require('./router/detail.js'); 
const chat = require('./router/chat.js').router;
// const chatio = require('./router/chat.js').io(server);

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
app.use('/users', express.static('uploads'));
app.use(chat);

app.use(iosoc(session, {autoSave : true}));
// app.use(chatio);


app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('html', ejs.renderFile);


server.listen(3000, function()
{
    console.log("서버가동");
})

