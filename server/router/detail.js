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
                uri : 'https://www.aladin.co.kr/search/wsearchresult.aspx',
                //encoding: null,
                headers: {Connection : 'Keep-Alive', 'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
                
                },
                qs: {SearchTarget : 'UsedStore', SearchWord : req.query.isbn}

            }, function(err5, res5, body4)
            {

                console.log(bookstore);
                const $3 = cheerio.load(body4);
                const tte = $3('.usedshop_off_text2_box').text();

                var array = tte.split(',');
                console.log(array);
                

            const $ = cheerio.load(iconv.decode(body2, 'EUC-KR'));
            const des = $('div.box_detail_content div.box_detail_article:first').text();
            const price = $('#container > div:nth-child(4) > form > div.box_detail_order > div.box_detail_price > ul > li:nth-child(1) > span.sell_price > strong').text();
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

            for(k in ulList)
            {
                if(ulList2[k] != '0')
                {
                    ulList3[ulList[k].title] = ulList2[k].cnt 
                }
            }

            console.log(ulList3);
            
            
            //const dis = $2('th').text();
            //const dis2 = $2('a').text();
            //console.log(dis.split(" "));
            //console.log(dis.replace(/(\s*)/g, ""), dis2.replace(/(\s*)/g, ""));
            
            res.render('detail2.html', {data : {title, img, author, originprice},  des : des, price : price, offline : {ulList, ulList2}, bookstore : bookstore})


            })
            
            

        })
        

        })
        
    })

    
})

module.exports = router;