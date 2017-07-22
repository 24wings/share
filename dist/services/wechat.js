"use strict";
const config_1 = require("./config");
const wechat_payment_node_1 = require("wechat-payment-node");
const tools = require("./tools");
let wechatPaymentInstance = new wechat_payment_node_1.default(config_1.CONFIG.wechatPay);
const WechatAPI = require('wechat-api');
var wechat = require('wechat');
const crypto = require("crypto");
var OAuth = require('wechat-oauth');
var middleware = require('wechat-pay').middleware;
var api = new WechatAPI(config_1.CONFIG.wechat.appid, config_1.CONFIG.wechat.appsecret);
var client = new OAuth(config_1.CONFIG.wechat.appid, config_1.CONFIG.wechat.appsecret);
var wx = require('wechat-jssdk');
var Payment = require('wechat-pay').Payment;
var payment = new Payment(config_1.CONFIG.wechatPayment);
class WeChatService {
    constructor() {
        this.wx = wx;
        this.client = client;
        this.wechat = wechat;
        this.payment = payment;
    }
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
    wechatPay(order) {
        return new Promise((resovle, reject) => {
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                if (err)
                    console.error(err);
                resovle(payargs);
            });
        });
    }
    getSDKParams(param) {
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
                if (err)
                    console.log(err);
                resolve(data);
            });
        });
    }
    getSignature(opt) {
        return new Promise((resolve, reject) => {
            api.getTicket((err, result) => {
                if (err)
                    console.error(err);
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
        });
    }
    async getJSSDKApiParams(opt) {
        let params = await this.getSDKParams();
        var signature = await this.getSignature({ noncestr: params['nonceStr'], timestamp: params['timestamp'], url: opt.url });
        params['signature'] = signature;
        return params;
    }
    async getAuthorizeURL(query) {
        var queryStr = `?`;
        queryStr += query.parent ? 'parent=' + query.parent : '';
        queryStr += query.taskId ? "&taskId=" + query.taskId : '';
        return client.getAuthorizeURL(`${config_1.CONFIG.domain}${config_1.CONFIG.oauthPath}${queryStr}`, '', 'snsapi_userinfo');
    }
    async wechatReturnMoney(order) {
        return new Promise(resolve => payment.getBrandWCPayRequestParams(order, function (err, payargs) {
            err ? console.log(err) : '';
            resolve(payargs);
        }));
    }
    /**
     * 微信支付确认回复
     */
    getPayReply() {
        return middleware(config_1.CONFIG.wechatPay).getNotify().done(function (message, req, res, next) {
            var openid = message.openid;
            var order_id = message.out_trade_no;
            var attach = {};
            try {
                attach = JSON.parse(message.attach);
            }
            catch (e) { }
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
    payRedpackOne(order) {
        var body = `
<xml>
<sign><![CDATA[E1EE61A91C8E90F299DE6AE075D60A2D]]></sign>
<mch_billno><![CDATA[${new Date().getTime()}]]></mch_billno>
<mch_id><![CDATA[${config_1.CONFIG.wechatPay.mchId}]]></mch_id>
<wxappid><![CDATA[${config_1.CONFIG.wechat.appid}]]></wxappid>
<send_name><![CDATA[${config_1.CONFIG.wechatName}]]></send_name>
<re_openid><![CDATA[${order.openid}]]></re_openid>
<total_amount><![CDATA[${order.money}]]></total_amount>
<total_num><![CDATA[1]]></total_num>
<wishing><![CDATA[${order.wishing ? order.wishing : '恭喜发财'}]]></wishing>
<client_ip><![CDATA[${tools.getIPAdress()}]]></client_ip>
<act_name><![CDATA[新年红包]]></act_name>
<remark><![CDATA[新年红包]]></remark>
<scene_id><![CDATA[PRODUCT_8]]></scene_id>
<consume_mch_id><![CDATA[10000097]]></consume_mch_id>
<nonce_str><![CDATA[50780e0cca98c8c8e814883e5caa672e]]></nonce_str>

</xml>

`;
    }
}
module.exports = new WeChatService();
