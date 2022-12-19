"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const prisma_service_1 = require("../prisma.service");
const pong_1 = require("./pong");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
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
        this.invitationGames = new Map();
        this.prisma = new prisma_service_1.PrismaService();
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
            if (game.getPongData().isPlaying === false) {
                this.gameHistory(game.getGameHistory());
                this.gameAchievements(game.getGameHistory());
                this.games.delete(game.gameId);
            }
        }
    }
    getAllGames(client) {
        let games = [];
        this.games.forEach((game, key) => {
            games.push({
                id: key,
                player_left: game.player_left,
                player_right: game.player_right,
            });
        });
        client.emit('getAllGames', {
            games: games
        });
        return games;
    }
    watchGame(client, user, gameId) {
        this.watchGame[user] = gameId;
        const game = this.games.get(gameId);
        if (game) {
            console.log("Game Exist Joining user", game);
            console.log("User : ", user);
            const parsed = JSON.parse(user);
            client.join(this.roomPrefix + gameId);
            game.spectators.add(user);
            console.log("Before Pong Data ", user.nickname);
            const gameUpData = game.update(parsed.nickname);
            const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
            console.log("pongData => ", pongData);
            client.emit('WatchUpdate', {
                pongData: pongData
            });
        }
        else if (!game) {
            console.log("Game not found !");
            client.emit('GameNotFound', {
                message: "Game Not found ! "
            });
        }
    }
    leaveGameAsWatcher(client, userId) {
        const gameId = this.watchGame[userId];
        const game = this.games.get(gameId);
        if (game) {
            if (client.in(this.roomPrefix + gameId))
                client.leave(this.roomPrefix + gameId);
            game.spectators.delete(userId);
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
                game.player_right.score = 20;
            }
            else if (game.player_right.id == nickname) {
                console.log("Deleting the right ! ", game.player_left.id);
                const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
                client.to(this.roomPrefix + gameId).emit('update', {
                    ffs: true,
                    leaver: game.player_right.id,
                    pongData: pongData
                });
                game.player_right.score = 20;
            }
        }
        this.gameHistory(game.getGameHistory());
        this.gameAchievements(game.getGameHistory());
        this.games.delete(game.gameId);
        console.log('-----------------------------------------------');
    }
    inviteGame(client, user, inviteeNickname) {
        const inviterNickname = user.nickname;
        this.invitationGames.set({ inviterNickname, inviteeNickname }, { user: user, client });
    }
    acceptInvite(client, user, inviteeNickname) {
        let userNickname = user.nickname;
        let invitation = this.invitationGames.get({ userNickname, inviteeNickname });
        if (invitation) {
            this.invitationGames.delete({ userNickname, inviteeNickname });
            const gameId = (0, uuid_1.v4)();
            console.log('an invitaion was accepted .');
            const playerRight = this.queue.shift();
            const game = new pong_1.default(gameId, JSON.parse(invitation.user).nickname, JSON.parse(user).nickname);
            this.games.set(gameId, game);
            this.PlayersGames[invitation.user] = gameId;
            this.PlayersGames[user] = gameId;
            this.currentGames[invitation.user] = gameId;
            this.currentGames[user] = gameId;
            const LeftSock = invitation.client;
            const RightSock = client;
            LeftSock.join(this.roomPrefix + gameId);
            RightSock.join(this.roomPrefix + gameId);
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
    }
    async gameHistory(data) {
        console.log('gameHistory findPlayerByNickname : ', data.winner);
        const _winner = await this.findPlayerByNickname(data.winner);
        const _loser = await this.findPlayerByNickname(data.loser);
        const game_history = await this.prisma.game_history.create({
            data: {
                winner_id: data.winner,
                winner_score: data.winnerScore,
                looser_id: data.loser,
                losser_score: data.loserScore,
            }
        });
    }
    async gameAchievements(data) {
        console.log("this prisma achivemenvt", this.prisma.achievements);
        if (data.loserScore === 0) {
            const CleanSheet = await this.prisma.achievements.create({
                data: {
                    name: "Boono",
                    playerId: data.winner,
                }
            });
        }
        const ziyach = await this.prisma.achievements.create({
            data: {
                name: "Ziyach",
                playerId: data.winner,
            }
        });
        const hamdaLlah = await this.prisma.achievements.create({
            data: {
                name: "Hamda Llah",
                playerId: data.loser,
            }
        });
    }
    async findPlayerById(userId) {
        if (!userId) {
            throw new common_1.NotFoundException('User Id is required');
        }
        const player = this.prisma.player.findUnique({
            where: {
                id: userId,
            }
        });
        if (!player) {
            throw new common_1.NotFoundException("User Id is not found");
        }
        return player;
    }
    async findPlayerByNickname(login) {
        console.log('login', login);
        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!player) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return player;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map