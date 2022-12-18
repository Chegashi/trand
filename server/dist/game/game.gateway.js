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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.roomPrefix = 'roomGameSocket';
        this.PlayersInQueue = [];
    }
    async handleConnection(client, ...args) {
        console.log("Client Game Connected", client.id);
    }
    async handleDisconnect(client) {
        console.log("Client disconnected", client.id);
        if (this.PlayersInQueue[client.id]) {
            console.log("This Plyaer is In Plyaer List  ... ", this.PlayersInQueue[client.id]);
            console.log("AAA");
            await this.handleLeaveGameAsPlayer(client, this.PlayersInQueue[client.id]);
        }
    }
    async handleNewPlayer(client, user) {
        console.log("newPlayer", client.id, user);
        this.PlayersInQueue[client.id] = user;
        return this.gameService.newPlayer(client, user);
    }
    async handleUpdate(client, user) {
        return this.gameService.update(client, user);
    }
    async handleLeaveGameAsPlayer(client, data) {
        console.log('-----------------------------------------------');
        console.log("This Player leave the game !", data);
        console.log('-----------------------------------------------');
        return this.gameService.leaveGameAsPlayer(client, data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Socket)
], GameGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("newPlayer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleNewPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveGameAsPlayer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleLeaveGameAsPlayer", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "game",
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map