"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const socket_io = require("socket.io");
const http = require("http");
const client_sessions = require("client-sessions");
const express_device = require("express-device");
const express_fileupload = require("express-fileupload");
const body_parser = require("body-parser");
const chamber_1 = require("./chamber");
const template_engine_1 = require("./template-engine");
const _main_router_1 = require("./routers/_main.router");
const PORT = process.env.PORT || 6700;
const app = express();
template_engine_1.installExpressApp(app);
app.use(express_fileupload({ safeFileNames: true, preserveExtension: true }));
app.use(express_device.capture());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(client_sessions({
    cookieName: 'session',
    secret: chamber_1.APP_SECRET,
    duration: 5 * 30 * 60 * 1000,
    activeDuration: 2 * 5 * 60 * 1000,
    cookie: {
        httpOnly: false,
        secure: false,
    }
}));
const server = http.createServer(app);
const io = socket_io(server);
io.on('connection', (socket) => {
    console.log('new socket:');
});
app.use((request, response, next) => {
    request.io = io;
    next();
});
app.use('/main', _main_router_1.MainRouter);
const publicPath = path.join(__dirname, '../_public');
const expressStaticPublicPath = express.static(publicPath);
app.use(expressStaticPublicPath);
server.listen(PORT);
console.log(`Listening on port ${PORT}...`);
