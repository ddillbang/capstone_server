var express = require('express');
var app = express();
var ejs = require('ejs');
const request = require('request');
const dbConnect = require('./db');
const { connect } = require('./db');
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

//sign up 내가함(10.10)
app.get('/signup', function(req,res){
    res.render('sign_up.html'); 
});
//sign up request thdaudtjq(10.10)
app.post('/signupX', function(req, res){
    console.log(req.body);
    
    dbConnect.connect();
    dbConnect.query('insert into USERS values(?, ?)', [req.body.user_ID , req.body.user_PW1] , function(error, result, fields){
        if(error){
                console.log(error);
        }
        console.log(result);
    });
    dbConnect.end();
});

app.listen(3000, function()
{
    console.log("서버가동");
})