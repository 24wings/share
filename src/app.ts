import express = require('express');
import path = require('path');
var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import middle = require('./middle');
import nunjucks = require('nunjucks');
import services = require('./services');




var app = express();

nunjucks.configure(path.resolve(__dirname, '../views'), { // 设置模板文件的目录，为views
    autoescape: true,
    express: app,
    noCache: true

})

app.use(middle.common.crossDomain)
    .set('view engine', 'html')
    //app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
    .use(logger('dev'))
    .use(bodyParser.json({ limit: '50mb' }))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    // 静态文件服务器
    .use(express.static(path.resolve(__dirname, '../public')))

    // 下面是路由
    .use('/wechat/oauth', middle.common.wechatOauth)
    .use('/payment', (req, res, next) => { })
    .get('/', (req, res) => res.redirect('/share'))
    .get('/share', middle.share.index)
    .all('/check', middle.common.replyAuthUrl)

    // share
    .get('/share', middle.share.index)
    .get('/share/recruit-student', middle.share.recruitStudent)
    .get('/share/person-center', middle.share.personCenter)
    .get('/share/full-info', middle.share.fullInfo)
    .get('/share/detail/:_id', middle.share.detail)
    .get('/share/publish', middle.share.publish)
    .get('/share/shop-center', middle.share.shopCenter)
    //  restful  api 
    .post('/api/uploadImage', middle.common.uploadBase64)
    .get('/rest/:modelName', middle.rest.getList)
    .post('/rest/:modelName', middle.rest.postOne)
    .get('/rest/:modelName/:_id', middle.rest.getDetail)
    .delete('/rest/:modelName/:_id', middle.rest.deleteOne)
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);
export =app;