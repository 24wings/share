import { CONFIG } from './config';
import { db } from '../models';
import { wechatService as wechat, WeixinOrder } from './wechat';
import tools = require('./tools')
import dbDo = require('./dbDo');
export ={
    CONFIG,
    db,
    wechat,
    tools,
    dbDo
}


async function test() {
    let taskRecords = await db.taskRecordModel.find({ 'shareDetail.user': { $in: ['5979aa66f97b400ef876681d'] } });
    console.log(taskRecords);

}


test();