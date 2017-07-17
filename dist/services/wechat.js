"use strict";
const config_1 = require("./config");
var Payment = require('wechat-pay').Payment;
var payment = new Payment(config_1.CONFIG.wechatPay);
module.exports = {
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
    wechatPay: (order) => {
        return new Promise((resovle, reject) => {
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                if (err)
                    console.error(err);
                resovle(payargs);
            });
        });
    }
};
