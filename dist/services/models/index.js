"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Task_1 = require("./Task");
const User_1 = require("./User");
const TaskTag_1 = require("./TaskTag");
const task_order_1 = require("./task-order");
mongoose.connect('mongodb://localhost:27017/test');
exports.db = {
    userModel: User_1.userModel,
    taskModel: Task_1.taskModel,
    taskTagModel: TaskTag_1.taskTagModel,
    taskOrder: task_order_1.taskOrder
};
