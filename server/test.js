const request = require('request');

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

const option = {
   
        query : '컴퓨터',
        display : 10
    
}

request.get({
    uri:'https://openapi.naver.com/v1/search/book.json',
    qs:option,
    headers : {
        'X-Naver-Client-Id' : CLIENT_ID,
        'X-Naver-Client-Secret' : CLIENT_SECRET
    }
}, function(err, res, body)
{
    let json = JSON.parse(body)
    console.log(json)
})