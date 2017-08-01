import fs = require('fs');
import tools = require('../tools');
import wechatTool from './wechat-tools';
import request = require('request');

interface WechatConfig {
    appid: string;
    mch_id: string;
    apiKey: string; //微信商户平台API密钥
    notify_url: string;
    trade_type: string | 'APP'; //APP, JSAPI, NATIVE etc.
    pfx: any;//微信商户平台证书 (optional，部分API需要使用)
}
export default class WechatPay {

    constructor(public wechatConfig: WechatConfig) { }

    payToOne(order: {
        partner_trade_no: string,
        openid: string,
        check_name?: string,
        amount: number,
        nonce_str?: string,
        desc: string,
        spbill_create_ip?: string,
        mch_appid?: string,
        mchid?: string,
        sign?: string
    }) {
        return new Promise((resolve, reject) => {
            order.check_name = order.check_name ? order.check_name : 'NO_CHECK';
            order.spbill_create_ip = order.spbill_create_ip ? order.spbill_create_ip : tools.getIPAdress();
            order.nonce_str = order.nonce_str ? order.nonce_str : wechatTool.getRadomStr();
            order.mch_appid = this.wechatConfig.appid;
            order.mchid = this.wechatConfig.mch_id;
            let sign = wechatTool.sign(order, this.wechatConfig.apiKey);
            console.log('queryStr:' + wechatTool.createQueryString(order));
            order.sign = sign;
            let body = wechatTool.bulildXml({ xml: order });
            console.log(body);
            request(wechatTool.urls.transfers, {
                method: 'POST',
                body: body,
                agentOptions: {
                    pfx: this.wechatConfig.pfx,
                    passphrase: this.wechatConfig.mch_id
                }
            }, (err, res, body) => {
                if (err) console.log(err);

                // let result = wechatTool.parseXml(body);
                console.log(res.body);
            })
        });
    }



}

