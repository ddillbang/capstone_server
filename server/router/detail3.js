const express = require('express');
const router = express.Router();
const request = require('request');
const xmltojs = require('xml-js');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

router.get('/detail3', function(req, res){
    res.render('detail3.html'); 
});

module.exports = router;