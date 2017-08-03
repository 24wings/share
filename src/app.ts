import express = require('express');
import path = require('path');
var favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import session = require('express-session');
import bodyParser = require('body-parser');
import { CommonMiddle } from './CommonMiddle';
import service = require('./services');

import nunjucks = require('nunjucks');
import { CONFIG, default as config } from './services/config';

import { Core } from './lib';
import { Middleware } from './middleware';

import moment = require('moment');
import test from './test/indext';


// test.testPayRequest();
// test.testWechatPayRequest()



var app = express();

var njk = nunjucks.configure(path.resolve(__dirname, '../views'), { // 设置模板文件的目录，为views
    autoescape: true,
    express: app,
    noCache: true,
})

var filters = {
    time: (date: Date) => moment(date).format('YYYY-MM-DD'),
    json: (obj) => JSON.stringify(obj),
    money: (money: number) => money.toFixed(2),
    boolean: (ok: boolean) => !!ok,
    myFault: (ok: boolean) => !ok
}

for (let key in filters) {
    njk.addFilter(key, filters[key]);

}

app.set('trust proxy', false) // trust first proxy 

app.use(Middleware.MiddlewareBuilder.buildMiddleware(CommonMiddle))

    .set('view engine', 'html')
    .all('/', service.wechat.wechat(service.CONFIG.wechat, (req, res, next) => {
        console.log(`ip:`, req.ip);
        let oauthUrl = config.wxOauth.getOauthUrl(`${service.CONFIG.domain}/wechat/oauth`, req.query);
        res.reply({ content: oauthUrl, type: 'text' });
    }))
    .use('/:service/:action', Core.Route.RouteBuilder.scannerRoutes(__dirname + '/Controller'))
    .use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        console.log(err);
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });



export =app;



