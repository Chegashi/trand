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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const otplib_1 = require("otplib");
const tfa_dto_1 = require("./dtos/tfa.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async authentication() {
    }
    async login(request, res) {
        const user = await this.authService.findORcreate(request.user);
        if (user.tfa === true) {
            res.cookie('2fa', user.id, { httpOnly: true, });
            return res.status(302).redirect(`http://localhost:3000/verify`);
        }
        const token = await this.authService.JwtAccessToken(user.id);
        const secretData = {
            token,
        };
        res.cookie(process.env.AUTHCOOKIE, secretData.token, { httpOnly: true, });
        return res.status(302).redirect(`http://localhost:3000/`);
    }
    async enable2fa(request, res) {
        const user = await this.authService.findById(request.cookies['2fa']);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otpauth_url = await this.authService.generateQrCode(user.id);
        console.log("otpauth_url", otpauth_url);
        return res.status(200).send(otpauth_url);
    }
    async verify2fa(body, request, res) {
        const user = await this.authService.findById(request.cookies['2fa']);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.tfaSecret) {
            throw new common_1.UnauthorizedException('2fa not enabled');
        }
        console.log("Before Verify", body.code, user.tfaSecret);
        const is_code_valid = await otplib_1.authenticator.verify({ token: body.code, secret: user.tfaSecret });
        if (!is_code_valid) {
            throw new common_1.UnauthorizedException('Invalid code');
        }
        console.log("After Verify", body.code, user.tfaSecret);
        const token = await this.authService.JwtAccessToken(user.id);
        const secretData = {
            token,
        };
        res.cookie(process.env.AUTHCOOKIE, secretData.token, { httpOnly: true, });
        res.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        res.status(200).send({
            message: "2FA verified"
        });
    }
    async logout(request, res) {
        res.clearCookie(process.env.AUTHCOOKIE);
        return res.status(302).redirect(`http://localhost:3000/`);
    }
};
__decorate([
    (0, common_1.Get)('/signup'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authentication", null);
__decorate([
    (0, common_1.Get)('/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/2fa/QrCode'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2fa", null);
__decorate([
    (0, common_1.Post)('/2fa/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tfa_dto_1.VeriftyTfaDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2fa", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map