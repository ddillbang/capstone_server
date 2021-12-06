const express = require('express');
const request = require('request');
const router = express.Router();
const xmltojs = require('xml-js');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

router.get('/', (req,res) =>{
    userrecom = {}
    if(req.session.user != undefined)
    {
        request.get({
            uri : 'http://220.94.2.145:8000/user',
            encoding: null,
            qs: {userid : req.session.user.id}
        }, function(err1,res1,body1)
        {
            var bd7 = JSON.parse(body1);
            console.log(bd7)

            request.get({
                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                qs: {d_isbn : bd7["result"][0][0]},
                headers : {
                    'X-Naver-Client-Id' : CLIENT_ID,
                    'X-Naver-Client-Secret' : CLIENT_SECRET
                }
            }, function(err2, res2, body2)
            {
                    var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                    let json2 = JSON.parse(bodyconvert2);
                    let jsonp2 = json2.rss.channel.item
                    var recomb2 = jsonp2.image._text
                    console.log(recomb2)
                    res.render('home2.html', {recom : recomb2} );

            })
        })
    }
    
})

router.get('/test', (req,res) =>{
    res.render('test.html');
})

router.post('/chattest', (req,res)=>{
    res.send(req.body.tosend);
})


module.exports = router;