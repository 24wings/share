import service = require('../services');
import express = require('express');
import fs = require('fs');
import path = require('path');
var wechat = require('wechat');
var OAuth = require('wechat-oauth');

var client = new OAuth(service.CONFIG.wechat.appid, service.CONFIG.wechat.appsecret);

export = {
    /**
     * 404 Not Found 默认页面
     */
    notFound: (req, res, next) => {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    },
    crossDomain: (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        /让options请求快速返回/
        req.method == 'OPTIONS' ? res.send(200) : next();
    },
    /**
     * 微信授权登录,重定向到 /?openid=${openid}
     */
    wechatOauth: (req: express.Request, res: express.Response) => {
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
        // console.log(req.query, code);

        client.getAccessToken(code, (err, result) => {
            console.dir(err);
            console.dir(result);
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            console.log('token=' + accessToken);
            console.log('openid=' + openid);
            client.getUser(openid, async function (err, result) {
                let user = await service.db.userModel.findOne({ openid }).exec();
                user = user ? user : await new service.db.userModel(result).save();
                res.redirect('/?openid=' + openid);
            });
        });
    },
    replyAuthUrl: wechat(service.CONFIG.wechat, (req, res, next) => {
        var url = client.getAuthorizeURL(`${service.CONFIG.domain}/wechat/oauth`, '', 'snsapi_userinfo');
        res.reply({
            content: url,
            type: 'text'
        });

    }),
    /**
     * 上传文件 测试接口
     */
    uploadBase64: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let base64 = req.body.base64;
        function uploadFile(file, filename) {
            return new Promise((resolve, reject) => {
                if (file.indexOf('base64,') != -1) {
                    file = file.substring(file.indexOf('base64,') + 7);
                }
                let randomFilename = new Date().getTime() + filename;
                let distpath = path.resolve(__dirname, '../../public/upload/' + randomFilename);

                fs.writeFile(distpath, new Buffer(file, 'base64'), (err) => {
                    err ? resolve(false) : resolve('/upload/' + randomFilename);
                });
            })
        }


        let url = await uploadFile(base64, req.body.filename || 'test.png');
        res.json({ ok: true, data: service.CONFIG.IP + url });

    },
    /**错误显示的页面  */
    errorHandler: (err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        console.log(err);
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }



}