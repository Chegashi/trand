"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const player_service_1 = require("../player/player.service");
function getIdUserFromToken(cookie) {
    if (!cookie) {
        return null;
    }
    const cookieArray = cookie.split(';');
    const cookieObject = {};
    if (cookieArray.length === 0)
        return null;
    cookieArray.forEach((cookie) => {
        const cookieKeyValue = cookie.split('=');
        cookieObject[cookieKeyValue[0]] = decodeURIComponent(cookieKeyValue[1]);
    });
    const token = cookieObject['auth-cookie'];
    const tokenArray = token.split('.');
    const tokenObject = JSON.parse(atob(tokenArray[1]));
    return (tokenObject);
}
let ChatGateway = class ChatGateway {
    constructor(playerservice) {
        this.playerservice = playerservice;
        this.roomPrefix = 'roomSocket';
    }
    async handleConnection(client, ...args) {
    }
    async handleJoinRoom(client, data) {
        if (!data.user)
            return;
        const user = await this.playerservice.findPlayerById(data.user.id);
        if (!user)
            return;
        if (!data.room)
            return;
        const room = await this.playerservice.getRoomById(data.user.id, data.room);
        if (!room)
            return;
        client.join(this.roomPrefix + data.roomId);
    }
    async handleMessage(client, data) {
        if (!data.room)
            return;
        const room = await this.playerservice.getRoomById(data.user.id, data.room);
        if (!room) {
            return;
        }
        const newMessage = await this.playerservice.sendMessageinRoom(data.user.id, data.msgTxt, data.room);
        const oldMessage = await this.playerservice.getMessagesOfRoom(data.user.id, data.room);
        if (!newMessage) {
            return;
        }
        this.wss.to(this.roomPrefix + data.roomId).emit("addmsg", {
            sender: {
                id: data.user.id,
                avatar: data.user.avatar,
                nickname: data.user.nickname,
            },
            OldMessages: oldMessage,
            message: newMessage
        });
    }
    async handleDisconnect(client) {
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Socket)
], ChatGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinroom"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("newmessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "chat",
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map