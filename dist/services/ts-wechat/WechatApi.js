"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatTool_1 = require("./WechatTool");
/**
 * access_token官方文档    https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
 */
class default_1 {
    constructor(appId, appSecrt) {
        this.appId = appId;
        this.appSecrt = appSecrt;
        this.URLS = {
            //&appid=APPID&secret=APPSECRET
            accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
            //access_token=ACCESS_TOKEN&type=jsapi
            ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=api'
        };
        //私有的token
        this.token = {
            access_token: '',
            expires_in: 0,
            lastModifyTime: 0
        };
        this.ticket = {
            ticket: '',
            expires_in: 0,
            lastModifyTime: 0
        };
    }
    //若不传入token,则自动调用底层方法获取token,若传入token,则使用token
    async getTicket(token) {
        if (!token) {
            token = await this.getAccessToken();
        }
        let ticket = await WechatTool_1.default.httpsGet(this.URLS.ticket + `access_token=${token}`);
        return ticket;
    }
    get isTokenInvalid() {
        return !!this.token.access_token && new Date().getTime() <= this.token.lastModifyTime + this.token.expires_in * 1000 && !!this.token.lastModifyTime;
    }
    /**
     * 自动缓存access_token,开心大胆的用吧
     */
    async getAccessToken() {
        if (this.isTokenInvalid) {
            return this.token.access_token;
        }
        else {
            let tokenStr = await WechatTool_1.default.httpsGet(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appId}&secret=${this.appSecrt}`);
            let token = JSON.parse(tokenStr);
            this.token.access_token = token.access_token;
            this.token.lastModifyTime = new Date().getTime();
            this.token.expires_in = parseInt(token.expires_in);
            return this.token.access_token;
        }
    }
}
exports.default = default_1;
