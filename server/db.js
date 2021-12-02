var mysql = require('mysql');
var db = {
        connectionLimit : 10,
        host : 'localhost',
        user : 'root',
        password : 'rhleh3060',
        database : 'test'
};

var dbp = mysql.createPool(db);

function getConnection() {
        return dbp;
}

module.exports = getConnection();
module.exports.d = db;