
import express = require('express');

export ={
    index : (req:express.Request,res:express.Response)=>{
            res.render('share/index')
    }
}
