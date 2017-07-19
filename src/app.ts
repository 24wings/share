import express = require('express');
import path = require('path');
var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import session = require('express-session');
import bodyParser = require('body-parser');
import middle = require('./middle');
import nunjucks = require('nunjucks');
import services = require('./services');
import { RouteBuilder } from './route';

import moment = require('moment');

import { ShareRoute } from './middle/ShareRoute';



var app = express();

var njk = nunjucks.configure(path.resolve(__dirname, '../views'), { // 设置模板文件的目录，为views
    autoescape: true,
    express: app,
    noCache: true,
})
//
njk.addFilter('time', function (obj: Date) {
    return moment(obj).format('YYYY-MM-DD');
})
njk.addFilter('json', function (obj) {
    return JSON.stringify(obj)
})
njk.addFilter('money', function (money: number) {
    return money.toFixed(2);
})
njk.addFilter('boolean', function (ok) {
    return !!ok;
});

// app.set('trust proxy', 1) // trust first proxy 

app.use(middle.common.crossDomain)
    .use(express.static(path.resolve(__dirname, '../public')))
    .set('view engine', 'html')
    //app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
    .use(logger('dev'))
    .use(bodyParser.json({ limit: '50mb' }))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(session({
        secret: 'keyboard cat',
        // resave: false,
        // saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 24 * 1000 }
    }))
    // 静态文件服务器
    .use(middle.common.storeUser)
    // 下面是路由
    .use('/wechat/oauth', middle.common.wechatOauth)
    .use('/payment', (req, res, next) => { })
    // .get('/', (req, res) => res.redirect('/share'))
    // .get('/share', middle.share.index)
    .all('/', middle.common.replyAuthUrl)
    .use('/share/:action', RouteBuilder.buildRoute(ShareRoute))
    /*
     // share
     .get('/share', middle.share.index)
     .get('/share/recruit-student', middle.share.recruitStudent)
     .get('/share/person-center', middle.share.personCenter)
     .get('/share/full-info', middle.share.fullInfoPage)
     .post('/share/full-info', middle.share.fixFullInfo)
     .get('/share/detail/:_id', middle.share.detail)
     .get('/share/publish', middle.share.publishPage)
     .post('/share/payTaskMoney', middle.share.payTaskMoney)
     .post('/share/publish', middle.share.publishTask)
     .get('/share/shop-center', middle.share.shopCenter)
     .get('/share/student-money', middle.share.studentMoney)
     .get('/share/myMoney', middle.share.myMoney)
     .get('/task/:_id', middle.share.taskDetail)
     .get('/share/getMoney', middle.share.getMoney)
     .get('/share/guide', middle.share.guide)
     .get('/share/task-list', middle.share.taskList)
     .get('/share/get-money-record', middle.share.getMoneyRecord)
     .get('/share/fansMoney', middle.share.fansMoney)
     .get('/share/money-log', middle.share.moneyLog)
     // test api
     .get('/share/test', async (req, res) => {
         var params = await services.wechat.getJSSDKApiParams({ url: 'http://' + req.hostname + req.originalUrl });
         console.log(params);
         res.render('share/test', { params });
     })
 
 */
    // common api
    .post('/api/uploadBase64', middle.common.uploadBase64)
    .get('/api/jssdk', async (req, res) => { var params = await services.wechat.getJSSDKApiParams({ url: req.query.url || 'http://' + req.hostname + req.originalUrl }); res.json({ ok: true, data: params }) })
    //  restful  api 
    .get('/rest/:modelName', middle.rest.getList)
    .post('/rest/:modelName', middle.rest.postOne)
    .get('/rest/:modelName/:_id', middle.rest.getDetail)
    .delete('/rest/:modelName/:_id', middle.rest.deleteOne)
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);
export =app;  