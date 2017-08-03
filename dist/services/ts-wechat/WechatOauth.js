"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatTool_1 = require("./WechatTool");
const querystring = require("querystring");
class default_1 {
    constructor(appid, appscrent, getToken, saveToken) {
        this.appid = appid;
        this.appscrent = appscrent;
    }
    /**
     * 返回Oauth验证Url .可额外附加重定向后的参数
     */
    getOauthUrl(redirect, queryObj, state = '', scope = 'snsapi_userinfo') {
        // wechatTool.urls.oauth
        let url = WechatTool_1.default.urls.oauth;
        let info = {
            appid: this.appid,
            redirect_uri: redirect,
            response_type: 'code',
            scope: scope,
            state: state,
        };
        return WechatTool_1.default.urls.oauth + '?' + querystring.stringify(info) + (queryObj ? querystring.stringify(queryObj) : '') + '#wechat_redirect';
    }
}
exports.default = default_1;
