import { CONFIG } from './config';
import https = require('https');
import tools = require('./tools');
import fetch from 'node-fetch';
import fs = require('fs');
import url = require('url');
import md5 = require('md5');
import sha1 = require('sha1');
import crypto = require('crypto');
var OAuth = require('wechat-oauth');

import WechatPayment from './wechat-pay';
var options = {
    appid: CONFIG.wechat.appid,
    mch_id: CONFIG.wechatPay.mchId,
    apiKey: CONFIG.wechat.appsecret, //微信商户平台API密钥
    notify_url: CONFIG.wechatPay.notifyUrl,
    trade_type: 'JSAPI', //APP, JSAPI, NATIVE etc.
    pfx: CONFIG.wechatPay.pfx //微信商户平台证书 (optional，部分API需要使用)
};

var wechatPaymentInstance = new WechatPayment(options);
const WechatAPI = require('wechat-api');
var wechat = require('wechat');

var middleware = require('wechat-pay').middleware;

var api = new WechatAPI(CONFIG.wechat.appid, CONFIG.wechat.appsecret);
var client = new OAuth(CONFIG.wechat.appid, CONFIG.wechat.appsecret, function (openid, callback) {
    // 传入一个根据openid获取对应的全局token的方法 
    // 在getUser时会通过该方法来获取token 
    fs.readFile('temp/access_token/' + openid + ':access_token.txt', 'utf8', function (err, txt) {
        if (err) { return callback(err); }
        callback(null, JSON.parse(txt));
    });
}, function (openid, token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等 
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例 
    // 持久化时请注意，每个openid都对应一个唯一的token! 
    fs.writeFile('temp/access_token/' + openid + ':access_token.txt', JSON.stringify(token), callback);
});

var wx = require('wechat-jssdk');
var Payment = require('wechat-pay').Payment;
var payment = new Payment(CONFIG.wechatPay);

export interface WeixinOrder {
    body: string;
    attach: string;
    out_trade_no: string;
    total_fee: number;
    spbill_create_ip: string;
    openid: string;
    trade_type: string | 'JSAPI';
    user?: string;
}

class WeChatService {
    wx = wx;
    client = client;
    wechat = wechat;

    payment = payment;
    /**
     * 微信公众平台支付接口
     * 参数订单数据
     * 
     *  {
            body: '参加活动付费1元',
            attach: '{"活动":"费用"}',
            out_trade_no: 'kfc' + (+new Date),
            total_fee: 100,
            spbill_create_ip: req.ip,
            openid: req.session.player.openid,
            trade_type: 'JSAPI'
        };
     * 返回订单json
     */
    wechatPay(order: WeixinOrder) {
        console.log('order:', order);
        return new Promise((resovle, reject) => {
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                if (err) { console.error(err); resovle(false) }
                resovle(payargs);
            });
        });
    }
    createMenu(menu) {
        menu = menu ? menu : {
            "button": [
                {
                    "type": "view",
                    "name": "商户指南",
                    "url": "http://www.baidu.com"

                },
                {
                    "type": "view",
                    "name": "赚钱指南",
                    "url": "http://www.baidu.com"

                }, {
                    "type": "view",
                    "name": "我要赚钱",
                    "url": `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx07a1ef24ca488840&redirect_uri=http%3A%2F%2Fwq8.youqulexiang.com%2Fwechat%2Foauth&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect`
                }]
        };
        return new Promise((resolve, reject) => {
            api.createMenu(menu, (err, result) => {
                if (err) console.error('创建微信错误');
                resolve(result);
            });
        })
    }

    removeMenu() {
        return new Promise((resolve, reject) => {
            api.removeMenu((err, result) => {
                if (err) console.error(err);
                resolve(result)
            });

        })
    }
    getSDKParams(param?) {
        var param = param || {
            debug: false,
            jsApiList: ['checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'],
            url: 'http://wq8.youqulexiang.com'
        };

        return new Promise((resolve, reject) => {
            api.getJsConfig(param, (err, data) => {
                if (err) console.log(err)

                resolve(data);
            });
        })
    }
    getSignature(opt: { noncestr, timestamp, url }) {
        return new Promise((resolve, reject) => {
            api.getTicket((err, result) => {
                if (err) console.error(err);
                console.log(result, opt.url);
                var str = '';
                str += 'jsapi_ticket=' + result.ticket;
                str += '&noncestr=' + opt.noncestr;
                str += '&timestamp=' + opt.timestamp;
                str += '&url=' + opt.url;
                var sha1 = crypto.createHash('sha1');

                var signatrue = sha1.update(str).digest('hex');
                console.log(str);
                console.log(signatrue);
                resolve(signatrue);
            });
        })
    }

    async getJSSDKApiParams(opt: { url, }) {
        let params = await this.getSDKParams();
        var signature = await this.getSignature({ noncestr: params['nonceStr'], timestamp: params['timestamp'], url: opt.url });
        params['signature'] = signature;
        return params;
    }

    async  getAuthorizeURL(query: { parent: string, taskId?: string }) {
        var queryStr = `?`;
        queryStr += query.parent ? 'parent=' + query.parent : '';
        queryStr += query.taskId ? "&taskId=" + query.taskId : '';
        return this.client.getAuthorizeURL(`${CONFIG.domain}${CONFIG.oauthPath}${queryStr}`, '', 'snsapi_userinfo');
        // return this.client.getAuthorizeURL(`${CONFIG.domain}${CONFIG.oauthPath}${queryStr}`, '', 'snsapi_userinfo');
    }
    async  wechatReturnMoney(order: WeixinOrder) {
        return new Promise(resolve =>
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                err ? console.log(err) : '';
                resolve(payargs)

            }))
    }
    /**
     * 微信支付确认回复
     */
    getPayReply(): (req, res, next) => void {
        return middleware(CONFIG.wechatPay).getNotify().done(function (message, req, res, next) {
            var openid = message.openid;
            var order_id = message.out_trade_no;
            var attach = {};
            try {
                attach = JSON.parse(message.attach);
            } catch (e) { }

            /**
             * 查询订单，在自己系统里把订单标为已处理
             * 如果订单之前已经处理过了直接返回成功
             */
            res.reply('success');

            /**
             * 有错误返回错误，不然微信会在一段时间里以一定频次请求你
             * res.reply(new Error('...'))
             */
        });
    }

    /**
     * 退款
     * 
     * 
     */
    refound() {
        payment.refund({
            out_trade_no: "kfc001",
            out_refund_no: 'kfc001_refund',
            total_fee: 10 * 100,
            refund_fee: 10 * 100
        }, function (err, result) {
            /**
             * 微信收到正确的请求后会给用户退款提醒
             * 这里一般不用处理，有需要的话有err的时候记录一下以便排查
             */
        });
    }
    /**
     * 微信发送商户平台的接口
     <xml>
    <sign><![CDATA[E1EE61A91C8E90F299DE6AE075D60A2D]]></sign>
    <mch_billno><![CDATA[0010010404201411170000046545]]></mch_billno>
    <mch_id><![CDATA[888]]></mch_id>
    <wxappid><![CDATA[wxcbda96de0b165486]]></wxappid>
    <send_name><![CDATA[send_name]]></send_name>
    <re_openid><![CDATA[onqOjjmM1tad-3ROpncN-yUfa6uI]]></re_openid>
    <total_amount><![CDATA[200]]></total_amount>
    <total_num><![CDATA[1]]></total_num>
    <wishing><![CDATA[恭喜发财]]></wishing>
    <client_ip><![CDATA[127.0.0.1]]></client_ip>
    <act_name><![CDATA[新年红包]]></act_name>
    <remark><![CDATA[新年红包]]></remark>
    <scene_id><![CDATA[PRODUCT_2]]></scene_id>
    <consume_mch_id><![CDATA[10000097]]></consume_mch_id>
    <nonce_str><![CDATA[50780e0cca98c8c8e814883e5caa672e]]></nonce_str>
    <risk_info>posttime%3d123123412%26clientversion%3d234134%26mobile%3d122344545%26deviceid%3dIOS</risk_info>
    </xml>
    
    
    只支持一个人微信红包
     *      */

    bulildXml(obj: Object) {
        let xml = ``
        for (let key in obj) {
            xml += `<${key}>${obj[key]}</${key}>
            `;
        }
        xml = `<xml>
            ${xml}
            </xml>
            `;
        return xml
    }
    buildSignStr(obj: Object) {
        var str = '';
        for (let key in obj) {
            str += `&${key}=${obj[key]}`;
        }
        str = str.startsWith(`&`) ? str.substring(1) : str;
        return str;
    }
    toOne(order: { money: number, openid: string, wishing?: string }) {

        let orderData = {
            partner_trade_no: new Date().getTime(), //商户订单号，需保持唯一性
            openid: order.openid,
            check_name: 'NO_CHECK',
            re_user_name: 'Mr Ma',
            amount: 100,
            desc: '红包',
            spbill_create_ip: tools.getIPAdress()
        }
        wechatPaymentInstance.transfers(orderData)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
    async payRedpackOne(order: { money: number, openid: string, wishing?: string }) {
        this.toOne(order)
        return;
        /*
        var str = '';
        var options = {
            amount: 100,
            check_name: 'NO_CHECK',
            desc: '节日快乐',
            mch_appid: CONFIG.wechat.appid,
            mchid: CONFIG.wechatPay.mchId,
            nonce_str: CONFIG.randomStr,
            openid: order.openid,
            partner_trade_no: new Date().getTime(),

            re_user_name: '影月',
            spbill_create_ip: tools.getIPAdress()
        };
        str = this.buildSignStr(options);
        str += `&key=${CONFIG.wechatPay.partnerKey}`;


        console.log('str:' + str);
        var signatrue = md5(str).toUpperCase();

        // var signatrue = sha1.update(str).digest('hex');
        console.log('signature:', signatrue);
        options['sign'] = signatrue;
        if (signatrue.length > 32) console.log('-----------------签名过长--------------------')
        let data = this.bulildXml(options);
        console.log(data);
        var parsed_url = url.parse('https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers');
        // console.log(`parsed_url`, parsed_url);
        var req = https.request({
            protocol: parsed_url.protocol,
            host: parsed_url.host,
            port: 443,
            path: parsed_url.path,
            pfx: CONFIG.wechatPay.pfx,
            passphrase:// 'password',//''
            CONFIG.wechatPay.mchId,//'password',
            method: 'POST',

        }, function (res) {
            var content = '';
            res.on('data', function (chunk) {
                content += chunk;
            });
            res.on('end', function () {
                console.log('end', content);
            });
        });

        req.on('error', function (e) {
            console.log('error:', e)
        });
        req.write(data);
        req.end();


        console.log('xml:', data)
        */
    }



}

export var wechatService = new WeChatService();