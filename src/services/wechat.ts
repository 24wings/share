import { CONFIG } from './config';
var Payment = require('wechat-pay').Payment;

var payment = new Payment(CONFIG.wechatPay);


export ={
    /**
     * 微信公众平台支付接口
     * 参数订单数据
     * 
     * 
     * 返回订单json
     */
    wechatPay: (order: {}) => {
        return new Promise((resovle, reject) => {
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                if (err) console.error(err)
                resovle(payargs);
            });
        });
    }


}