"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express_1 = require("express");
const chamber_1 = require("../chamber");
const users_router_1 = require("./users.router");
exports.MainRouter = express_1.Router();
exports.MainRouter.options(`*`, cors(chamber_1.corsOptions));
exports.MainRouter.use('/users', cors(chamber_1.corsOptions), users_router_1.UserRouter);
