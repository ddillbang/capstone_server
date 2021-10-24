const express = require('express');
const router = express.Router();
const request = require('request');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

router.get('/search', (req,res) =>{

    const option = {
   
        query : req.query.query,
        display : 100
    
}

    request.get({
        uri:'https://openapi.naver.com/v1/search/book.json',
        qs:option,
        headers : {
            'X-Naver-Client-Id' : CLIENT_ID,
            'X-Naver-Client-Secret' : CLIENT_SECRET
        }
    }, function(err, res2, body)
    {
        let json = JSON.parse(body)
        res.render('search.html', {data : json})
    })

    
})

module.exports = router;