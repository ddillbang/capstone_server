const express = require('express');
const router = express.Router();
const request = require('request');
const xmltojs = require('xml-js');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

router.get('/detail', (req,res) =>{

    const option = {
   
        d_isbn : req.query.isbn,
}

    request.get({
        uri:'https://openapi.naver.com/v1/search/book_adv.xml',
        qs:option,
        headers : {
            'X-Naver-Client-Id' : CLIENT_ID,
            'X-Naver-Client-Secret' : CLIENT_SECRET
        }
    }, function(err, res2, body)
    {
        request.get({
            url:'https://www.kyobobook.co.kr/product/detailViewKor.laf',
            encoding: null,
            qs: {barcode : req.query.isbn}
        },function(err2, res3, body2)
        {

        const $ = cheerio.load(iconv.decode(body2, 'EUC-KR'));
        const des = $('div.box_detail_content div.box_detail_article:first').text();
        var bodyconvert = xmltojs.xml2json(body, {compact: true, spaces:4 });
        let json = JSON.parse(bodyconvert)
        let jsonp = json.rss.channel.item
        try{
             title = jsonp.title._text
        }
        catch(exception)
        {
             title =''
        }
            
        try{
             img = jsonp.image._text
        }
        catch(exception)
        {
             img = ''
        }

        res.render('detail.html', {data : {title, img}, des : des})

        })
        
    })

    
})

module.exports = router;