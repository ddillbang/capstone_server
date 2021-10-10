var mysql = require('mysql');
var db = {
        connectionLimit : 10,
        host : 'localhost',
        user : 'root',
        password : 'audtjq123',
        database : 'server'
};

var dbp = mysql.createPool(db);

function getConnection() {
        return dbp;
        }


module.exports = getConnection();