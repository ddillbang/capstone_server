const express = require('express');
const router = express.Router();
const request = require('request');
const xmltojs = require('xml-js');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

var bookstore = {
    광화문 : {
        경도 : '37.57097960745399', 
        위도 : '126.97775984304913',
    },
    잠실 : {
        경도 : '37.514294685529975', 
        위도 : '127.10126186913054'
    },
    강남 : {
        경도 : '37.50387610632525', 
        위도 : '127.02404876728407'
    },
    가든파이브 : {
        경도 : '37.477367223688695',
        위도 : '127.12472825563543'
    },
    건대 : {
        경도 : '37.53912758934873',
        위도 : '127.07128416913109'
    },
    동대문 : {
        경도 : '37.56874659862493', 
        위도 : '127.00765306804509'
    }
}

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

        

        request.get({
            uri : 'http://www.kyobobook.co.kr/prom/2013/general/StoreStockTable.jsp',
            encoding: null,
            qs: {barcode : req.query.isbn, ejkgb : 'KOR'}
        }, function(err4, res4, body3)
        {
            request.get({
            uri : 'https://book.naver.com/search/search.naver',
            encoding: null,
            qs: {query : req.query.isbn}

            }, function(err5,res5, body4)
            {

            const $3 = cheerio.load(iconv.decode(body4, 'EUC-KR'));
            const link = $3('#searchBiblioList > li > dl > dt > a');
            
            request.get({
                uri : link.attr('href'),
                encoding: null

            }, function(err6, res6, body5)
            {

              

            const $4 = cheerio.load(body5);
            const $ = cheerio.load(iconv.decode(body2, 'EUC-KR'));
            const des = $('div.box_detail_content div.box_detail_article:first').text();
            const price = $('#container > div:nth-child(4) > form > div.box_detail_order > div.box_detail_price > ul > li:nth-child(1) > span.sell_price > strong').text();
            const fullcontent = $('#container > div:nth-child(7) > div.content_left > div:nth-child(5)');

            const cost_info = $4('#productListLayer');
            var bodyconvert = xmltojs.xml2json(body, {compact: true, spaces:4 });
            let json = JSON.parse(bodyconvert);
            
            let jsonp = json.rss.channel.item
            let author = jsonp.author._text;
            let originprice = jsonp.price._text;
            
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
            const $2 = cheerio.load(iconv.decode(body3, 'EUC-KR'));

            const dis = $2('th');
            const dis2 = $2('a');
            ulList = [];
            ulList2 = [];
            ulList3 = {};
            var k = 0;
            dis.each(function(i, elem)
            {
                if(($2(this).text()).replace(/(\s*)/g, "") != ''){
                    
                    ulList[k] = {
                        title : ($2(this).text()).replace(/(\s*)/g, ""),
                        
                    }
                    k++;
                }

            })

            dis2.each(function(i, elem)
            {
                ulList2[i] = {
                    cnt : ($2(this).text()).replace(/(\s*)/g, ""), 
                }

            })

            for(var k = 0; k < ulList.length; ++k)
            {
                if(ulList2[k].cnt != '0')
                {
                    ulList3[ulList[k].title] = ulList2[k].cnt 
                }
            }

            /*request.get({
                uri : 'http://210.113.232.104:8000/plus',
                encoding: null,
                qs: {isbn : req.query.isbn, content : des}

            }, function(err7, res7, body7)
            {
                console.log(JSON.parse(body7));*/
                res.render('detail2.html', {data : {title, img, author, originprice}, fulldes : fullcontent ,des : des, costinfo : cost_info,price : price, offline : {ulList, ulList2}, bookstore : bookstore})
            /*})*/

            
            
            })

            

            

            })

            


            })
            
            

        })
        

        })
        
    })

    


module.exports = router;