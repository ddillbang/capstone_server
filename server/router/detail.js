const express = require('express');
const router = express.Router();
const request = require('request');
const xmltojs = require('xml-js');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const axios = require('axios');
const { query } = require('express');
const db = require('../db');

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
    },
    디큐브 : {
        경도 : '37.50912998204819', 
        위도 : '126.88881903068152'
    },
    목동 : {
        경도 : '37.52840215038431', 
        위도 : '126.87499172680128'
    },
    서울대 : {
        경도 : '37.46005134064367', 
        위도 : '126.95047276860745'
    },
    수유 : {
        경도 : '37.63837791525465', 
        위도 : '127.02648372680358'
    },
    영등포 : {
        경도 : '37.517143136786025', 
        위도 : '126.90412044029556'
    },
    은평 : {
        경도 : '37.63717092135103', 
        위도 : '126.9182189096165'
    },
    이화여대 : {
        경도 : '37.56154056048309', 
        위도 : '126.94676756913152'
    },
    천호 : {
        경도 : '37.54064261531199', 
        위도 : '127.12499298447183'
    },
    청량리 : {
        경도 : '37.58077800270892', 
        위도 : '127.047525151945'
    },
    합정 : {
        경도 : '37.55020095513928', 
        위도 : '126.91207888262572'
    },
    대구 : {
        경도 : '35.870661258651815',
        위도 : '128.59486043428907'
    },
    반월당 : {
        경도 : '35.866535628531466',
        위도 : '128.59078029621543'
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
            //const fullcontent = $('#container > div:nth-child(7) > div.content_left > div:nth-child(5)');

            var cost_info = []
            for(var i = 1; i <11; ++i)
            {
                var cost1= $4('#productListLayer > ul > li > .npay_wrap > a').eq(2*i - 2);
                var cost_info2 = $4('#productListLayer > ul > li > span').eq(i);
                cost_info.push("<div>" + cost1 + "<br>" +cost_info2 + "</div>")
            }

            
            var bodyconvert = xmltojs.xml2json(body, {compact: true, spaces:4 });
            let json = JSON.parse(bodyconvert);
            
            let jsonp = json.rss.channel.item
            try{
                 author = jsonp.author._text;
            }
            catch(exception)
            {
                author =''
            }
            try{
                originprice = jsonp.price._text;
           }
           catch(exception)
           {
               originprice =''
           }
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

            if(req.session.user != undefined)
            {
                qstoflask = {isbn : req.query.isbn, content : des, userid : req.session.user.id}
            }else{
                qstoflask = {isbn : req.query.isbn, content : des}
            }
            request.get({
                uri : 'http://127.0.0.1:5000/plus',
                encoding: null,
                qs: qstoflask

            }, function(err7, res7, body7)
            {
                var bd7 = JSON.parse(body7);


                request.get({
                    uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                    qs: {d_isbn : bd7["result"][0]},
                    headers : {
                        'X-Naver-Client-Id' : CLIENT_ID,
                        'X-Naver-Client-Secret' : CLIENT_SECRET
                    }
                }, function(err9, res9, body9)
                {
                        var bodyconvert2 = xmltojs.xml2json(body9, {compact: true, spaces:4 });
                        let json2 = JSON.parse(bodyconvert2);
                        let jsonp2 = json2.rss.channel.item
			try{
                        recomb2 = [jsonp2.image._text, bd7["result"][0]]
			}
			catch(exception)
			{
				recomb2 = [,]
			}
                        request.get({
                            uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                            qs: {d_isbn : bd7["result"][1]},
                            headers : {
                                'X-Naver-Client-Id' : CLIENT_ID,
                                'X-Naver-Client-Secret' : CLIENT_SECRET
                            }
                            
                        },function(err10, res10, body10)
                        {
                            var bodyconvert3 = xmltojs.xml2json(body10, {compact: true, spaces:4 });
                            let json3 = JSON.parse(bodyconvert3);
                            let jsonp3 = json3.rss.channel.item
			try{
                            recomb3 = [jsonp3.image._text, bd7["result"][1]]
			}
				catch(exception){
					recomb3=[,]
				}
                            request.get({
                                uri:'https://openapi.naver.com/v1/search/book_adv.xml',
                                qs: {d_isbn : bd7["result"][2]},
                                headers : {
                                'X-Naver-Client-Id' : CLIENT_ID,
                                'X-Naver-Client-Secret' : CLIENT_SECRET
                            }
                            }, function(err11, res11, body11)
                            {
                                var bodyconvert4 = xmltojs.xml2json(body11, {compact: true, spaces:4 });
                                let json4 = JSON.parse(bodyconvert4);
                                let jsonp4 = json4.rss.channel.item
				    try{
                                recomb4 = [jsonp4.image._text, bd7["result"][2]]
				    }
				    catch(exception){
					    recomb4=[,]
				    }
                                db.query('select * from board WHERE isbn = ?',[req.query.isbn],
                                
                                    function(err, result)
                                    {
                                        if(err){
                                            console.log(error);
                                        }else{
                                        if(!result[0])
                                        {
                                            dbre = undefined
                                        }
                                        else{
                                            dbre = result
                                        }
                                        }

                                        var usession = {};
                                    if(req.session.user)
                                    {
                                        usession = req.session
                                    }
					 
                                        res.render('detail4.html', {dbdata : {dbre},data : {title, img, author, originprice} ,des : des, costinfo : {cost_info,cost_info2},price : price, offline : {ulList, ulList2}, bookstore : bookstore, recomb : {recomb2,recomb3, recomb4}, usession : usession})
                                    }
                                )

                                

                            })
                        })

                })

                
            })

            
            
            })

            

            

            })

            


            })
            
            

        })
        

        })
        
    })

    


module.exports = router;
