import { CONFIG } from './config';
import { db } from '../models';
import { wechatService as wechat, WeixinOrder } from './wechat';
import tools = require('./tools')
import dbDo = require('./dbDo');
import { WechatPay } from './ts-wechat';
let pay = new WechatPay({
    appid: CONFIG.wechat.appid,
    mch_id: CONFIG.wechatPay.mchId,
    apiKey: CONFIG.wechatPay.partnerKey,
    notify_url: CONFIG.wechatPay.notifyUrl,
    pfx: CONFIG.wechatPay.pfx,
    trade_type: 'APP',
});

// pay.payToOne({
// openid: 'ovMVW1sJAw2eGoiOiBHoZgxOE0cE',
// partner_trade_no: new Date().getTime().toString(),
// amount: 500,
// desc: '商户支付'
// });

export ={
    CONFIG,
    db,
    wechat,
    tools,
    dbDo
}


