"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
exports.CONFIG = {
    oldAuth: 'shop.xxbuy.net',
    newAuth: '',
    domain: 'http://yuedu.youqulexiang.com',
    IP: 'http://47.92.87.28',
    wechat: {
        token: 'sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR',
        appid: 'wx8bdcc982b8477839',
        appsecret: 'ffe69aaff2487a7f1557f4e2e33952e6',
        encodingAESKey: 'A985jVM2v8QeiVHi85ILizNeLNqjI68yHmUjn46I2JM',
        checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
    },
    wechatPay: {
        partnerKey: "minglu12minglu12minglu12minglu12",
        appId: 'wx8bdcc982b8477839',
        mchId: "1447627402",
        notifyUrl: "http://wq8.youqulexiang.com/payment/",
        pfx: fs.readFileSync(path.resolve(__dirname, '../../temp/apiclient_cert.p12'))
    }
    // wechatClient: ''
};
