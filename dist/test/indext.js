"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../services/config");
const service = require("../services");
exports.default = new class {
    constructor() {
        this.user = {
            openid: 'ovMVW1sJAw2eGoiOiBHoZgxOE0cE'
        };
    }
    async testPayRequest() {
        let payargs = await config_1.default.wxPay.getBrandWCPayRequestParams({ openid: this.user.openid, body: '支付', total_fee: 100 });
        console.log(`payargs:`, payargs);
    }
    async testWechatPayRequest() {
        service.wechat.wechatPay({
            body: 'ss',
            attach: 'sa',
            spbill_create_ip: service.tools.getIPAdress(),
            openid: this.user.openid,
            out_trade_no: new Date().getTime().toString(),
            trade_type: 'JSAPI',
            total_fee: 100,
        });
    }
    testPuip() {
    }
};
