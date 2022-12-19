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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const otplib_1 = require("otplib");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async findORcreate(data) {
        const player = await this.prisma.player.findUnique({
            where: { email: data.email },
        });
        if (!player)
            return this.prisma.player.create({
                data: {
                    nickname: data.nickname,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    avatar: data.avatar,
                    email: data.email,
                },
            });
        return player;
    }
    async findById(PlayerId) {
        const player = await this.prisma.player.findUnique({
            where: { id: PlayerId },
        });
        return player;
    }
    async generateQrCode(playerId) {
        const player = await this.findById(playerId);
        if (!player) {
            throw new common_1.NotFoundException("User Id is not found");
        }
        const otpauth_url = otplib_1.authenticator.keyuri(player.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, player.tfaSecret);
        return { otpauth_url };
    }
    async JwtAccessToken(playerId) {
        return this.jwtService.sign({
            playerId,
        }, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWTEXPIRATION
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map