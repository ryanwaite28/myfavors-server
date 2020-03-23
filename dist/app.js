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
const user_service_1 = require("./services/user.service");
const PORT = process.env.PORT || 8000;
const app = express();
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
template_engine_1.installExpressApp(app);
const server = http.createServer(app);
const io = socket_io(server);
io.on('connection', (socket) => {
    console.log('new socket:');
});
app.use((request, response, next) => {
    request.io = io;
    next();
});
app.get('', user_service_1.UserService.root_route);
const binPath = path.join(__dirname, '../_bin');
app.use(express.static(binPath));
server.listen(PORT);
console.log(`Listening on port ${PORT}...`);
