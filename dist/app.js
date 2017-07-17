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
const middleware_1 = require("./middleware");
exports.app = express();
exports.app.use(middle.common.crossDomain);
nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: exports.app
});
// app.engine('html',nunjucks.render);
// view engine setup
// app.set('views', path.resolve(__dirname, '../views'));
exports.app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
exports.app.use(logger('dev'));
exports.app.use(bodyParser.json({ limit: '50mb' }));
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(cookieParser());
exports.app.use(express.static(path.resolve(__dirname, '../public')));
exports.app.all('/check', middleware_1.middleware.wechatMiddle.replyAuthUrl);
// app.use('/api/user', userRouter);
// app.use('/api/rest', restRouter);
exports.app.use('/payment', (req, res, next) => { });
exports.app.get('/', (req, res) => res.redirect('/share'))
    .use('/wechat/oauth', middle.common.wechatOauth)
    .get('/share', middle.share.index);
// 上传图片接口
exports.app.post('/api/uploadImage', middleware_1.middleware.uploader.uploadBase64);
// app.get('/share',share.index)
// catch 404 and forward to error handler
exports.app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handler
exports.app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
