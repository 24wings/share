import { CONFIG } from '../config';
var wechat = require('wechat');
var OAuth = require('wechat-oauth');

var client = new OAuth(CONFIG.wechat.appid, CONFIG.wechat.appsecret);

export var wechatMiddle = {
    replyAuthUrl: wechat(CONFIG.wechat, (req, res, next) => {
        var url = client.getAuthorizeURL(`http://wq8.youqulexiang.com/wechat/oauth`, '', 'snsapi_userinfo');
        res.reply({
            content: url,
            type: 'text'
        });

    }),

}