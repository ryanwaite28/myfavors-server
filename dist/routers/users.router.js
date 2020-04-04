"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("../services/user.service");
exports.UserRouter = express_1.Router();
exports.UserRouter.get('', user_service_1.UserService.main);
exports.UserRouter.get('/check-session', user_service_1.UserService.check_session);
