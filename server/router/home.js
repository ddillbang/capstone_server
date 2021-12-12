const express = require('express');
const { UTF8 } = require('mysql/lib/protocol/constants/charsets');
const request = require('request');
const router = express.Router();
const xmltojs = require('xml-js');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

var recomb2=[,],recomb3=[,],recomb4=[,],recomb5=[,];

router.get('/', (req,res) =>{
    userrecom = {}
    if(req.session.user == undefined)
    {
        randomb = 'none'
    }else{
        randomb = req.session.user.id
    }
        request.get({
            uri : 'http://127.0.0.1:5000/user',
            encoding: null,
            qs: {userid : randomb}
        }, function(err1,res1,body1)
        {
            var bd7 = JSON.parse(body1);
            console.log(bd7)

            request.get({
                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                qs: {d_isbn : bd7["result"][0]},
                headers : {
                    'X-Naver-Client-Id' : CLIENT_ID,
                    'X-Naver-Client-Secret' : CLIENT_SECRET
                }
            }, function(err2, res2, body2)
            {
                    var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                    let json2 = JSON.parse(bodyconvert2);
                    let jsonp2 = json2.rss.channel.item
                    try{
                        recomb2 = [jsonp2.image._text,bd7["result"][0]]
                    }
                    catch(exception)
                    {
                        recomb2 = ''
                    }
                    
                    request.get({
                        uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                        qs: {d_isbn : bd7["result"][1]},
                        headers : {
                            'X-Naver-Client-Id' : CLIENT_ID,
                            'X-Naver-Client-Secret' : CLIENT_SECRET
                        }
                    }, function(err2, res2, body2)
                    {
                            var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                            let json2 = JSON.parse(bodyconvert2);
                            let jsonp2 = json2.rss.channel.item
                            try{
                                recomb3 = [jsonp2.image._text,bd7["result"][1]]
                            }
                            catch(exception)
                            {
                                recomb3 = ''
                            }

                            request.get({
                                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                                qs: {d_isbn : bd7["result"][2]},
                                headers : {
                                    'X-Naver-Client-Id' : CLIENT_ID,
                                    'X-Naver-Client-Secret' : CLIENT_SECRET
                                }
                            }, function(err2, res2, body2)
                            {
                                    var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                                    let json2 = JSON.parse(bodyconvert2);
                                    let jsonp2 = json2.rss.channel.item
                                    try{
                                        recomb4 = [jsonp2.image._text,bd7["result"][2]]
                                    }
                                    catch(exception)
                                    {
                                        recomb4 = ''
                                    }
                
                                    
                                    
                
                            })

                            request.get({
                                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                                qs: {d_isbn : bd7["result"][3]},
                                headers : {
                                    'X-Naver-Client-Id' : CLIENT_ID,
                                    'X-Naver-Client-Secret' : CLIENT_SECRET
                                }
                            }, function(err2, res2, body2)
                            {
                                    var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                                    let json2 = JSON.parse(bodyconvert2);
                                    let jsonp2 = json2.rss.channel.item
                                    try{
                                        recomb5 = [jsonp2.image._text,bd7["result"][3]]
                                    }
                                    catch(exception)
                                    {
                                        recomb5 = ''
                                    }
                
                                    
                                    
                
                            })

                            request.get({
                                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                                qs: {d_isbn : bd7["result"][4]},
                                headers : {
                                    'X-Naver-Client-Id' : CLIENT_ID,
                                    'X-Naver-Client-Secret' : CLIENT_SECRET
                                }
                            }, function(err2, res2, body2)
                            {
                                    var bodyconvert2 = xmltojs.xml2json(body2, {compact: true, spaces:4 });
                                    let json2 = JSON.parse(bodyconvert2);
                                    let jsonp2 = json2.rss.channel.item
                                    try{
                                        recomb6 = [jsonp2.image._text, bd7["result"][4]]
                                    }
                                    catch(exception)
                                    {
                                        recomb6 = ''
                                    }

                                    var usession = {};
                                    if(req.session.user)
                                    {
                                        usession = req.session
                                    }
                
                                    res.render('home2.html', {recom : {recomb2, recomb3, recomb4, recomb5, recomb6}, usession : usession} );
                                    
                
                            })
        
                            
                            
        
                    })
                    
                    

            })
        })
    
    
})

router.get('/test', (req,res) =>{
    res.render('test.html');
})

router.post('/chattest', (req,res)=>{
    res.send(req.body.tosend);
})

router.post('/ctl_login', (req,res)=>{
    var id = req.body.id
    var pw = req.body.pw

    request.get({
        uri : 'http://127.0.0.1:5000/ctl',
        encoding: null,
        qs: {id : id, pw : pw}
    }, function(err3,res3, body3)
    {
        console.log(JSON.parse(body3));
        res.send(JSON.parse(body3))
    })
})

module.exports = router;
