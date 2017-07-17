"use strict";
const config_1 = require("./config");
var Payment = require('wechat-pay').Payment;
var payment = new Payment(config_1.CONFIG.wechatPay);
module.exports = {
    /**
     * 微信公众平台支付接口
     * 参数订单数据
     *
     *
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
