"use strict";
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const middle = require("./middle");
const nunjucks = require("nunjucks");
var app = express();
nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: app,
    noCache: true
});
app.use(middle.common.crossDomain)
    .set('view engine', 'html')
    .use(logger('dev'))
    .use(bodyParser.json({ limit: '50mb' }))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/wechat/oauth', middle.common.wechatOauth)
    .use('/payment', (req, res, next) => { })
    .get('/', (req, res) => res.redirect('/share'))
    .get('/share', middle.share.index)
    .all('/check', middle.common.replyAuthUrl)
    .get('/share', middle.share.index)
    .get('/share/recruit-student', middle.share.recruitStudent)
    .get('/share/person-center', middle.share.personCenter)
    .get('/share/full-info', middle.share.fullInfo)
    .get('/share/detail/:_id', middle.share.detail)
    .get('/share/publish', middle.share.publish)
    .get('/share/shop-center', middle.share.shopCenter)
    .post('/api/uploadImage', middle.common.uploadBase64)
    .get('/rest/:modelName', middle.rest.getList)
    .post('/rest/:modelName', middle.rest.postOne)
    .get('/rest/:modelName/:_id', middle.rest.getDetail)
    .delete('/rest/:modelName/:_id', middle.rest.deleteOne)
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);
module.exports = app;
