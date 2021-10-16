const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../db');

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

module.exports = router;