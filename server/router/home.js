const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>{
    res.render('home2.html');
})

router.get('/test', (req,res) =>{
    res.render('test.html');
})

router.post('/chattest', (req,res)=>{
    res.send(req.body.tosend);
})


module.exports = router;