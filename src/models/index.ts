import mongoose = require('mongoose');
import { taskModel } from './Task';
import { userModel } from './User';
import { taskTagModel } from './TaskTag';

import { taskRecordModel } from './TaskRecord';
mongoose.connect('mongodb://localhost:27017/test');


export var db = {
    userModel,
    taskModel,
    taskTagModel,
    taskRecordModel
}