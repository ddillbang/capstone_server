var express = require('express');
var app = express();
var ejs = require('ejs');
//const { request } = require('express');
const request = require('request');

app.use('/static', express.static(__dirname + '/public'))

app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('html', ejs.renderFile);
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));  

const CLIENT_ID = 'W12PsIX84oIcyfufTCCG';
const CLIENT_SECRET = 'jO2h2HTVCh';

app.get('/', (req,res) =>{
    res.render('home.html');
})

app.get('/search', (req,res) =>{

    const option = {
   
        query : req.query.query,
        display : 10
    
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



app.listen(3000, function()
{
    console.log("서버가동");    
})