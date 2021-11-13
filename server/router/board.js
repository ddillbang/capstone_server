const express = require('express');
const session = require('express-session');
const { getConnection } = require('../db');
const router = express.Router();
const db = require('../db');
const multer = require('multer');



var storage = multer.diskStorage({
    destination : function (req,file,cb)
    {
        cb(null, 'uploads/')
    },
    filename : function(req,file,cb)
    {
        cb(null, file.originalname)
    }
})

var upload = multer({storage : storage, limits: {fileSize: 5 * 1024*1024}})

router.post('/image', upload.single('file'), (req,res)=>{

    
    res.send('http://localhost:3000/users/' + req.file.filename);
    console.log(req.file);
})

router.get('/board/:cur', (req,res) =>{

    var page_size = 10;
    var page_list_size = 10;
    var no="";
    var totalPageCount = 0;

    var qS = 'select count(*) as cnt from board';
    db.query(qS,function(error2,data)
    {
        if(error2)
        {
            console.log(error2 + "게시판 mysql 조회실패");
            return;
        }

        totalPageCount = data[0].cnt;
        var curPage = req.params.cur;

        if(totalPageCount < 0)
        {
            totalPageCount = 0;
        }

        var totalPage = Math.ceil(totalPageCount / page_size);
        var totalSet = Math.ceil(totalPage / page_list_size);
        var curSet = Math.ceil(curPage / page_list_size) 
        var startPage = ((curSet - 1) * 10) + 1 
        var endPage = (startPage + page_list_size) - 1; 


        
if (curPage < 0) {
    no = 0
    } else {
    no = (curPage - 1) * 10
    }
        
    var paging = {
    "curPage": curPage,
    "page_list_size": page_list_size,
    "page_size": page_size,
    "totalPage": totalPage,
    "totalSet": totalSet,
    "curSet": curSet,
    "startPage": startPage,
    "endPage": endPage
    };

    var usession = {};


    if(req.session.user)
    {
        usession = req.session;
    }


    
    
    var qS2 = 'select * from board order by idx desc limit ?,?';
    db.query(qS2,[no,page_size], function(error, result)
    {
        if (error) {
            console.log("페이징 에러" + error);
            return
            }
            res.render('board.html', {data : result, paging : paging, usession : usession});


    })
    
    })
})

router.get('/insert', function(req,res)
{
    res.render('insert.html');
})

router.post('/insert', function(req,res)
{
    var body = req.body;
    console.log(req.body);
    db.query('insert into board(u_id, title, content) value (?,?,?)', [req.session.user.id,body.subject, body.content], function()
    {
        
        res.redirect('/board/1');
    })
})

router.get('/bdetail/:id', function(req, res)
{
    
        db.query('select * from board where idx = ?', [req.params.id], function(error, result)
        {
            
                    res.render('bdetail.html', {data : result });
            })

})

router.get('/bdelete/:id', function(req, res)
{
    
        db.query('delete from board where idx = ?', [req.params.id], function(error, result)
        {
            
                    
                    res.redirect('/board/1')
            })

})

module.exports = router;