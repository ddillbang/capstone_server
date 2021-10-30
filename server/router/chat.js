const express = require('express');
const session = require('express-session');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const router = express.Router();


//testcode
router.get('/chat', function (req, res){
    res.render('chat.html');
})

module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('sibal');
    });
};



module.exports = router;
