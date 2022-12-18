"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const pong_1 = require("./pong");
const uuid_1 = require("uuid");
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
                return;
            }
            visited.add(value);
        }
        return value;
    };
};
let GameService = class GameService {
    constructor() {
        this.games = new Map();
        this.queue = [];
        this.PlayersGames = [];
        this.currentGames = [];
        this.WatchersGames = [];
        this.roomPrefix = 'roomGameSocket';
    }
    newPlayer(client, user) {
        console.log('Adding a new Player.', user);
        this.queue.push({ user: user, client });
        if (this.queue.length === 2) {
            const gameId = (0, uuid_1.v4)();
            console.log('QUEUE IS FULL .');
            const playerLeft = this.queue.shift();
            const playerRight = this.queue.shift();
            const game = new pong_1.default(gameId, JSON.parse(playerLeft.user).nickname, JSON.parse(playerRight.user).nickname);
            this.games.set(gameId, game);
            this.PlayersGames[playerLeft] = gameId;
            this.PlayersGames[playerRight] = gameId;
            this.currentGames[playerLeft.user] = gameId;
            this.currentGames[playerRight.user] = gameId;
            const LeftSock = playerLeft.client;
            const RightSock = playerRight.client;
            LeftSock.join(this.roomPrefix + gameId);
            RightSock.join(this.roomPrefix + gameId);
            console.log('-----------------------------------------------');
            console.log('-----------------------------------------------');
            const replacerFunc = () => {
                const visited = new WeakSet();
                return (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (visited.has(value)) {
                            return;
                        }
                        visited.add(value);
                    }
                    return value;
                };
            };
            const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
            const rightData = JSON.stringify(game.update(game.player_right.id), replacerFunc());
            console.log(" => ", rightData);
            LeftSock.to(this.roomPrefix + gameId).emit('matchFound', {
                pongData: pongData,
            });
            RightSock.to(this.roomPrefix + gameId).emit('matchFound', {
                pongData: rightData,
            });
        }
        return { client: client, user: user };
    }
    update(client, user) {
        const parsed = JSON.parse(user.user);
        const gameId = this.PlayersGames[user];
        const game = this.games.get(gameId);
        if (game) {
            if (parsed.nickname == game.player_left.id) {
                game.onUpdate(game.player_left.id, user.positon);
            }
            else if (parsed.nickname == game.player_right.id) {
                game.onUpdate(game.player_right.id, user.positon);
            }
            const pongData = JSON.stringify(game.update(parsed.nickname), replacerFunc());
            client.to(this.roomPrefix + gameId).emit('update', {
                pongData: pongData
            });
        }
    }
    leaveGameAsPlayer(client, user) {
        console.log('-----------------------------------------------');
        console.log("User : ", user);
        const gameId = this.currentGames[user];
        const parsed = JSON.parse(user);
        const nickname = parsed.nickname;
        console.log("Inside LeaveGameAsPlayer", gameId);
        const game = this.games.get(gameId);
        if (game) {
            if (game.player_left.id == nickname) {
                const pongData = JSON.stringify(game.update(game.player_right.id), replacerFunc());
                client.to(this.roomPrefix + gameId).emit('update', {
                    ffs: true,
                    leaver: game.player_left.id,
                    pongData: pongData
                });
                console.log("Deleting the left ! ", game.player_right.id);
            }
            else if (game.player_right.id == nickname) {
                console.log("Deleting the right ! ", game.player_left.id);
                const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
                client.to(this.roomPrefix + gameId).emit('update', {
                    ffs: true,
                    leaver: game.player_right.id,
                    pongData: pongData
                });
            }
        }
        console.log('-----------------------------------------------');
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map