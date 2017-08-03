import wechatTool from './WechatTool';
import querystring = require('querystring');
export default class {
    /**
     * 返回Oauth验证Url .可额外附加重定向后的参数
     */
    getOauthUrl(redirect, queryObj?: Object, state = '', scope = 'snsapi_userinfo') {
        // wechatTool.urls.oauth
        let url = wechatTool.urls.oauth;
        let info = {
            appid: this.appid,
            redirect_uri: redirect,
            response_type: 'code',
            scope: scope,
            state: state,
        };
        return wechatTool.urls.oauth + '?' + querystring.stringify(info) + (queryObj ? querystring.stringify(queryObj) : '') + '#wechat_redirect';
    }


    constructor(public appid: string, public appscrent, getToken?, saveToken?) { }


}