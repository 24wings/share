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
import { CONFIG } from './services/config';

import { Core } from './lib';
import { Middleware } from './middleware';

import moment = require('moment');





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

// app.set('trust proxy', 1) // trust first proxy 

app.use(Middleware.MiddlewareBuilder.buildMiddleware(CommonMiddle))

    .set('view engine', 'html')
    .all('/', service.wechat.wechat(service.CONFIG.wechat, (req, res, next) => {
        var parent = req.query.parent;
        console.log(req.query)
        var url = service.wechat.client.getAuthorizeURL(`${service.CONFIG.domain}/wechat/oauth` + (parent ? '?parent=' + parent : ''), '', 'snsapi_userinfo');

        res.reply({ content: url, type: 'text' });
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