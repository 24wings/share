import mongoose = require('mongoose');
import { IUser } from './User';
var taskSchema = new mongoose.Schema({
    title: String,
    totalMoney: { type: Number, default: 0.00 },
    shareMoney: { type: Number, default: 0.00 },
    taskTag: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskTag' },
    imageUrl: { type: String },
    websiteUrl: String,
    createDt: { type: Date, default: Date.now },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // 浏览数量
    pv: { type: Number, default: 0 },
    clickNum: { type: Number, default: 0 },
    /**
     * 已经浏览过的ip
     */
    ips: { type: [String], default: [] }
});

export interface ITask extends mongoose.Document {
    ips: string[];
    pv: number;
    createDt: Date;
    totalMoney: number;
    shareMoney: number;


}

export var taskModel = mongoose.model<ITask>('Task', taskSchema);