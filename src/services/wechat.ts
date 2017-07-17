import { CONFIG } from './config';
var Payment = require('wechat-pay').Payment;

var payment = new Payment(CONFIG.wechatPay);

interface WeixinOrder {
    body: string;
    attach: string;
    out_trade_no: string;
    total_fee: number;
    spbill_create_ip: string;
    openid: string;
    trade_type: string | 'JSAPI';
}

export ={
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
    wechatPay: (order: WeixinOrder) => {
        return new Promise((resovle, reject) => {
            payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                if (err) console.error(err)
                resovle(payargs);
            });
        });
    }


}