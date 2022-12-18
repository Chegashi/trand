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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const player_service_1 = require("../player/player.service");
var onlineUsers = [];
let EventsGateway = class EventsGateway {
    constructor(playerservice) {
        this.playerservice = playerservice;
    }
    async handleConnection(client, ...args) {
    }
    async handleDisconnect(client) {
        const index = onlineUsers.findIndex((u) => {
            return (u.client.includes(client.id));
        });
        if (index !== -1) {
            const ind = onlineUsers[index].client.indexOf(client.id);
            if (ind !== -1) {
                onlineUsers[index].client.splice(ind, 1);
                if (onlineUsers[index].client.length === 0) {
                    client.broadcast.emit('onlineUsersFront', onlineUsers.filter((u) => u.client.length > 0));
                }
            }
        }
    }
    async handleOnlineUsers(client, data) {
        if (!data.user || !data.user.id)
            return;
        const user = this.playerservice.findPlayerById(data.user.id);
        if (!user)
            return;
        console.log("this is user: ", user);
        const index = onlineUsers.findIndex((u) => {
            return (u.user === data.user.id);
        });
        if (index === -1)
            onlineUsers.push({ user: data.user.id, client: [client.id] });
        else
            onlineUsers[index].client.push(client.id);
        this.wss.emit('onlineUsersFront', onlineUsers.filter((u) => u.client.length > 0));
        console.log(onlineUsers);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Socket)
], EventsGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('onlineUsersBack'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleOnlineUsers", null);
EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map