var mysql = require('mysql');
var db = {
        connectionLimit : 10,
        host : 'localhost',
        user : 'root',
        password : '1111',
        database : 'server'
};

var dbp = mysql.createPool(db);

function getConnection() {
        return dbp;
}

module.exports = getConnection();
module.exports.d = db;