import { CONFIG, default as config } from './config';
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


async function getOfficeUser() {
    let user = await db.userModel.findOne({ nickname: 'admin', openid: 'admin' }).exec();
    if (user) { return user }
    else {
        user = await new db.userModel({ nickname: 'admin', openid: 'admin' }).save();
        return user;
    }
}


export ={
    CONFIG,
    db,
    wechat,
    tools,
    dbDo,
    pay,
    getOfficeUser
}





