"use strict";
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const middle = require("./middle");
const nunjucks = require("nunjucks");
const moment = require("moment");
var app = express();
nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: app,
    noCache: true,
})
    .addFilter('time', function (obj) {
    return moment(obj).format('YYYY-MM-DD');
});
// app.set('trust proxy', 1) // trust first proxy 
app.use(middle.common.crossDomain)
    .set('view engine', 'html')
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
    .use(middle.common.storeUser)
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/wechat/oauth', middle.common.wechatOauth)
    .use('/payment', (req, res, next) => { })
    .get('/share', middle.share.index)
    .all('/check', middle.common.replyAuthUrl)
    .get('/share', middle.share.index)
    .get('/share/recruit-student', middle.share.recruitStudent)
    .get('/share/person-center', middle.share.personCenter)
    .get('/share/full-info', middle.share.fullInfo)
    .get('/share/detail/:_id', middle.share.detail)
    .get('/share/publish', middle.share.publishPage)
    .post('/share/payTaskMoney', middle.share.payTaskMoney)
    .post('/share/publish', middle.share.publishTask)
    .get('/share/shop-center', middle.share.shopCenter)
    .post('/api/uploadImage', middle.common.uploadBase64)
    .get('/rest/:modelName', middle.rest.getList)
    .post('/rest/:modelName', middle.rest.postOne)
    .get('/rest/:modelName/:_id', middle.rest.getDetail)
    .delete('/rest/:modelName/:_id', middle.rest.deleteOne)
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);
module.exports = app;
