"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const config_1 = require("../services/config");
let WechatRoute = class WechatRoute extends lib_1.Core.Route.BaseRoute {
    constructor() { super(); }
    doAction(action, method, next) {
        console.log(action);
        switch (action) {
            case 'oauth': return this.oauth;
            case 'jssdk': return this.getJSSDKSignature;
            case 'payment': return this.service.wechat.getPayReply();
            case 'create-menu': return this.createMenu;
            case 'remove-menu': return this.removeMenu;
            case 'accessToken': return this.accessToken;
            default: return this.notFound;
        }
    }
    /**创建微信公众号按钮 */
    async createMenu() {
        let action = await this.service.wechat.createMenu('');
        this.res.json({ ok: true, data: action });
    }
    async accessToken() {
        let token = await config_1.default.wxApi.accessToken();
        this.res.json({ ok: true, data: token });
    }
    before() { this.next(); }
    after() { this.next(); }
    async removeMenu() {
        let action = await this.service.wechat.removeMenu();
        this.res.json({
            ok: true, data: action
        });
    }
    async payment() {
        let money = this.req.body;
        let ip = this.service.tools.pureIp(this.req.ip);
        var payargs = await this.service.wechat.wechatReturnMoney({
            attach: '',
            spbill_create_ip: ip,
            out_trade_no: '' + new Date().toString(),
            trade_type: 'JSAPI',
            openid: this.req.session.user.openid,
            body: '',
            total_fee: money
        });
        this.res.end(payargs);
    }
    oauth() {
        var code = this.req.query.code;
        var parent = this.req.query.parent;
        var taskId = this.req.query.taskId;
        // console.log(this.req.query, code);
        this.service.wechat.client.getAccessToken(code, (err, result) => {
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            this.req.session.accessToken = accessToken;
            this.res.locals.accessToken = accessToken;
            this.service.wechat.client.getUser(openid, async (err, result) => {
                let user = await this.service.db.userModel.findOne({ openid }).exec();
                if (user) {
                    await user.update({ accessToken }).exec();
                }
                else {
                    result.accessToken = accessToken;
                    if (parent) {
                        result.parent = parent;
                        console.log('新用户的师傅是' + parent);
                        await this.db.userModel.findByIdAndUpdate(parent, { $inc: { todayStudent: 1, totalStudent: 1 } }).exec();
                    }
                    else {
                        console.log('新用户没有师傅');
                    }
                    user = await new this.db.userModel(result).save();
                }
                this.req.session.user = user;
                this.res.locals.user = user;
                if (taskId) {
                    this.res.redirect('/share/index');
                    // res.redirect('/task/' + taskId)
                }
                else {
                    this.res.redirect('/share/index?openid=' + openid);
                }
            });
        }, (err, result) => {
        });
    }
    notFound() {
        this.res.render('error');
    }
    async getJSSDKSignature() {
        let json = await this.service.wechat.getJSSDKApiParams({ url: this.req.url });
        this.res.json(json);
    }
};
WechatRoute = __decorate([
    lib_1.Core.Route.Controller({
        service: 'wechat',
        viewPath: 'wechat'
    })
], WechatRoute);
exports.default = WechatRoute;
