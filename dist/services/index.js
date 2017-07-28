"use strict";
const config_1 = require("./config");
const models_1 = require("../models");
const wechat_1 = require("./wechat");
const tools = require("./tools");
const dbDo = require("./dbDo");
async function test() {
    let taskRecords = await models_1.db.taskRecordModel.find({ 'shareDetail.user': { $in: ['5979aa66f97b400ef876681d'] } });
    console.log(taskRecords);
}
test();
module.exports = {
    CONFIG: config_1.CONFIG,
    db: models_1.db,
    wechat: wechat_1.wechatService,
    tools,
    dbDo
};
