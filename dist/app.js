"use strict";
const express = require("express");
const path = require("path");
var favicon = require('serve-favicon');
const CommonMiddle_1 = require("./CommonMiddle");
const service = require("./services");
const nunjucks = require("nunjucks");
const lib_1 = require("./lib");
const middleware_1 = require("./middleware");
const moment = require("moment");
var app = express();
var njk = nunjucks.configure(path.resolve(__dirname, '../views'), {
    autoescape: true,
    express: app,
    noCache: true,
});
var filters = {
    time: (date) => moment(date).format('YYYY-MM-DD'),
    json: (obj) => JSON.stringify(obj),
    money: (money) => money.toFixed(2),
    boolean: (ok) => !!ok,
    myFault: (ok) => !ok
};
for (let key in filters) {
    njk.addFilter(key, filters[key]);
}
// app.set('trust proxy', 1) // trust first proxy 
app.use(middleware_1.Middleware.MiddlewareBuilder.buildMiddleware(CommonMiddle_1.CommonMiddle))
    .set('view engine', 'html')
    .all('/', service.wechat.wechat(service.CONFIG.wechat, (req, res, next) => {
    var parent = req.query.parent;
    console.log(req.query);
    var url = service.wechat.client.getAuthorizeURL(`${service.CONFIG.domain}/wechat/oauth` + (parent ? '?parent=' + parent : ''), '', 'snsapi_userinfo');
    res.reply({ content: url, type: 'text' });
}))
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
