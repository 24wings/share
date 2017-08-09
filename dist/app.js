"use strict";
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');
const CommonMiddle_1 = require("./CommonMiddle");
const service = require("./services");
const fs = require("fs");
const nunjucks = require("nunjucks");
const config_1 = require("./services/config");
const lib_1 = require("./lib");
const middleware_1 = require("./middleware");
const moment = require("moment");
// test.testPayRequest();
// test.testWechatPayRequest()
var app = express();
var njk = nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: app,
    noCache: true,
});
var filters = {
    time: (date) => moment(date).format('YYYY-MM-DD'),
    json: (obj) => JSON.stringify(obj),
    money: (money) => { if (typeof money == 'string')
        money = parseFloat(money); return money.toFixed(2); },
    boolean: (ok) => !!ok,
    myFault: (ok) => !ok
};
for (let key in filters) {
    njk.addFilter(key, filters[key]);
}
app.set('trust proxy', false); // trust first proxy 
app.use(middleware_1.Middleware.MiddlewareBuilder.buildMiddleware(CommonMiddle_1.CommonMiddle))
    .set('view engine', 'html')
    .all('/', service.wechat.wechat(service.CONFIG.wechat, (req, res, next) => {
    console.log(`ip:`, req.ip);
    let oauthUrl = config_1.default.wxOauth.getOauthUrl(`${service.CONFIG.domain}/wechat/oauth`, req.query);
    res.reply({ content: oauthUrl, type: 'text' });
}))
    .use('/admin', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../public/index.html'), (err, data) => {
        if (err)
            console.log(err);
        res.end(data);
    });
})
    .use('/:service/:action', lib_1.Core.Route.RouteBuilder.scannerRoutes(__dirname + '/Controller'))
    .use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
