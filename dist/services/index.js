"use strict";
const config_1 = require("./config");
const models_1 = require("../models");
const wechat_1 = require("./wechat");
const tools = require("./tools");
const dbDo = require("./dbDo");
const ts_wechat_1 = require("./ts-wechat");
let pay = new ts_wechat_1.WechatPay({
    appid: config_1.CONFIG.wechat.appid,
    mch_id: config_1.CONFIG.wechatPay.mchId,
    apiKey: config_1.CONFIG.wechatPay.partnerKey,
    notify_url: config_1.CONFIG.wechatPay.notifyUrl,
    pfx: config_1.CONFIG.wechatPay.pfx,
    trade_type: 'APP',
});
pay.payToOne({
    openid: 'ovMVW1sJAw2eGoiOiBHoZgxOE0cE',
    partner_trade_no: new Date().getTime().toString(),
    amount: 500,
    desc: '商户支付'
});
module.exports = {
    CONFIG: config_1.CONFIG,
    db: models_1.db,
    wechat: wechat_1.wechatService,
    tools,
    dbDo
};
