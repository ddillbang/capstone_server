var mysql = require('mysql');
var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'audtjq123',
        database : 'server'
});

module.exports = connection;