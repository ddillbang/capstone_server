var express = require('express');
var app = express();
var ejs = require('ejs');
var session = require('express-session'); //session module;

const home = require('./router/home.js'); 
const search = require('./router/search.js'); 
const login = require('./router/login.js'); 

app.use(session({
    secret: '1234@', //it can be same as cookie setting
    resave: false,
    saveUninitialized: true
}));
app.use(home);
app.use(search);
app.use(login);
app.use('/static', express.static(__dirname + '/public'))


app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('html', ejs.renderFile);

app.listen(3000, function()
{
    console.log("서버가동");
})