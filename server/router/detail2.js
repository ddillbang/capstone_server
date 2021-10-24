const express = require('express');
const router = express.Router();
const request = require('request');
const xmltojs = require('xml-js');

const key = '6d77223fdcdb5c74aedab49e861577aa723cc65f900fe1c12e25bad9eca1ad73';

router.get('/detail2', (req,res) =>{

    const option = {
        cert_key : key,
        result_style : "json",
        page_no : 1,
        page_size : 1,
        isbn : req.query.isbn,
        
}

    request.get({
        uri:'http://seoji.nl.go.kr/landingPage/SearchApi.do',
        qs:option,
    }, function(err, res2, body)
    {
        let json = JSON.parse(body)
        console.log(json);
        res.render('detail2.html', {data : json})
    })

    
})

module.exports = router;