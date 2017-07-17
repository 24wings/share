"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const middle = require("./middle");
const nunjucks = require("nunjucks");
exports.app = express();
exports.app.use(middle.common.crossDomain);
nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: exports.app
});
exports.app.set('view engine', 'html');
//app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
exports.app.use(logger('dev'));
exports.app.use(bodyParser.json({ limit: '50mb' }));
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(cookieParser());
exports.app.use(express.static(path.resolve(__dirname, '../public')));
exports.app.use('/payment', (req, res, next) => { });
exports.app.get('/', (req, res) => res.redirect('/share'))
    .use('/wechat/oauth', middle.common.wechatOauth)
    .all('/check', middle.common.replyAuthUrl)
    .get('/share', middle.share.index)
    .post('/api/uploadImage', middle.common.uploadBase64)
    .get('/share', middle.share.index)
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);
