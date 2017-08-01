"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools = require("../tools");
const wechat_tools_1 = require("./wechat-tools");
const request = require("request");
class WechatPay {
    constructor(wechatConfig) {
        this.wechatConfig = wechatConfig;
    }
    payToOne(order) {
        return new Promise((resolve, reject) => {
            order.check_name = order.check_name ? order.check_name : 'NO_CHECK';
            order.spbill_create_ip = order.spbill_create_ip ? order.spbill_create_ip : tools.getIPAdress();
            order.nonce_str = order.nonce_str ? order.nonce_str : wechat_tools_1.default.getRadomStr();
            order.mch_appid = this.wechatConfig.appid;
            order.mchid = this.wechatConfig.mch_id;
            let sign = wechat_tools_1.default.sign(order, this.wechatConfig.apiKey);
            console.log('queryStr:' + wechat_tools_1.default.createQueryString(order));
            order.sign = sign;
            let body = wechat_tools_1.default.bulildXml({ xml: order });
            console.log(body);
            request(wechat_tools_1.default.urls.transfers, {
                method: 'POST',
                body: body,
                agentOptions: {
                    pfx: this.wechatConfig.pfx,
                    passphrase: this.wechatConfig.mch_id
                }
            }, (err, res, body) => {
                if (err)
                    console.log(err);
                // let result = wechatTool.parseXml(body);
                console.log(res.body);
            });
        });
    }
}
exports.default = WechatPay;
