import express = require('express');
import path = require('path');
var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import middle = require('./middle');
import nunjucks = require('nunjucks');
import services = require('./services');




export var app = express();
app.use(middle.common.crossDomain);
nunjucks.configure(path.resolve(__dirname, '../views'), { // 设置模板文件的目录，为views
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

//app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/payment', (req, res, next) => { });
app.get('/', (req, res) => res.redirect('/share'))
    .use('/wechat/oauth', middle.common.wechatOauth)
    .all('/check', middle.common.replyAuthUrl)
    .get('/share', middle.share.index)
    // 上传图片测试接口
    .post('/api/uploadImage', middle.common.uploadBase64)
    .get('/share', middle.share.index)
    // catch 404 and forward to error handler
    .use(middle.common.notFound)
    .use(middle.common.errorHandler);