const express = require('express');
const session = require('express-session');
const router = express.Router();

router.use(session({
    secret: '1234@', //it can be same as cookie setting
    resave: false,
    saveUninitialized: true,
    store: new MysqlStore(db.d)
}));

module.exports = function(){
    return session;
};