"use strict";
const config_1 = require("../config");
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
const models_1 = require("../models");
var client = new OAuth(config_1.CONFIG.wechat.appid, config_1.CONFIG.wechat.appsecret);
module.exports = {
    crossDomain: (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        /让options请求快速返回/;
        req.method == 'OPTIONS' ? res.send(200) : next();
    },
    /**
     * 微信授权登录,重定向到 /?openid=${openid}
     */
    wechatOauth: (req, res) => {
        /* {
"openid": "OPENID",
"nickname": "NICKNAME",
"sex": "1",
"province": "PROVINCE"
"city": "CITY",
"country": "COUNTRY",
"headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
"privilege": [
  "PRIVILEGE1"
  "PRIVILEGE2"
]
} */
        var code = req.query.code;
        console.log(req.query, code);
        client.getAccessToken(code, (err, result) => {
            console.dir(err);
            console.dir(result);
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            console.log('token=' + accessToken);
            console.log('openid=' + openid);
            client.getUser(openid, async function (err, result) {
                let user = await models_1.db.userModel.findOne({ openid }).exec();
                if (user) {
                }
                else {
                    user = await new models_1.db.userModel(result).save();
                }
                res.redirect('/?openid=' + openid);
            });
        });
    }
};
