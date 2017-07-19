import mongoose = require('mongoose');
import { ITask } from './Task';
import { IUser } from './User';

var taskOrderSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    createDt: { type: Date, default: Date.now },
    //受益的钱
    money: { type: Number, default: 0 },
    toPeople: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


export interface ITaskOrder extends mongoose.Document {
    task: ITask;
    createDt: Date;
    money: Number;
    toPeople: IUser;
}
export var taskOrder = mongoose.model<ITaskOrder>('TaskOrder', taskOrderSchema);

