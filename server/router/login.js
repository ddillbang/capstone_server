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
router.post('/signupX', function(req, res){
    console.log(req.body);
    

    db.query('insert into USERS values(?, ?)', [req.body.user_ID , req.body.user_PW1] , function(error, result, fields){
        if(error){
                console.log(error);
        }
        console.log(result);
    });

    res.redirect('/');

});

module.exports = router;