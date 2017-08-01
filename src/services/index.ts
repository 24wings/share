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