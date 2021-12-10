const express = require('express');
const router = express.Router();
const db = require('../db');


router.use(express.json()); 
router.use(express.urlencoded( {extended : false } ));  


//sign up 내가함(10.10)
router.get('/signup', function(req,res){
    res.render('sign_up.html'); 
});
//sign up request thdaudtjq(10.10)
router.post('/signup', function(req, res){
    console.log(req.body);
    

    db.query('insert into USERS values(?, ?)', [req.body.user_ID , req.body.user_PW1] , function(error, result, fields){
        if(error){
                console.log(error);
        }
        console.log(result);
    });

    res.redirect('/');

});

//sign in by song (10.12)
router.get('/signin', function(req, res){
    res.render('sign_in.html');
});
//sign in request (10.12)
router.post('/signin', function(req, res){
    console.log(req.body); //test code
    console.log("test");
    //console.log(req);

    let uid = req.body.user_ID;
    let pw = req.body.user_PW;

    db.query('select u_id, u_passwd from USERS where u_id = ? AND u_passwd = ?', [uid, pw], //check db
    function(error, result){
        console.log("query result : " + result);
        if(error){//error
            console.log(error);
        }
        else if(!result[0]) { //로그인에 실패
            return res.send('check your id or password <a herf="/signin">signin</a>');
        }
        else{ //로그인 성공
            req.session.user = {
                id : uid,
                authorized : true
            }
            // console.log(req.session); // testcode
            req.session.save(function(){
                res.redirect('/');
            })
        }
    });
});

//testcode
router.get('/login', function(req, res){
    if(req.session.user == undefined){
        res.send('please login <a herf="/signin">signin</a>');
    }
    else{
        res.send('welcome ' + req.session.user.id);
    }
});

router.get('/logout', function(req, res){
    if(req.session.user == undefined){
        res.redirect('/');
    }
    else{
        req.session.destroy(function(){
            console.log('session distroied');
            res.redirect('/');
        })
    }
})

module.exports = router;