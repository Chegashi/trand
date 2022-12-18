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
exports.UpdatePlayerDto = exports.UpdateProtectedPasswordDto = exports.JoinProtectedRoomDto = exports.SetPwdToPublicChatRoomDto = exports.CreateProtectedRoomDto = exports.MutePlayerInRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MutePlayerInRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MutePlayerInRoomDto.prototype, "room_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], MutePlayerInRoomDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MutePlayerInRoomDto.prototype, "login", void 0);
exports.MutePlayerInRoomDto = MutePlayerInRoomDto;
class CreateProtectedRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProtectedRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProtectedRoomDto.prototype, "pwd", void 0);
exports.CreateProtectedRoomDto = CreateProtectedRoomDto;
class SetPwdToPublicChatRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetPwdToPublicChatRoomDto.prototype, "room_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetPwdToPublicChatRoomDto.prototype, "pwd", void 0);
exports.SetPwdToPublicChatRoomDto = SetPwdToPublicChatRoomDto;
class JoinProtectedRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JoinProtectedRoomDto.prototype, "room_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JoinProtectedRoomDto.prototype, "pwd", void 0);
exports.JoinProtectedRoomDto = JoinProtectedRoomDto;
class UpdateProtectedPasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateProtectedPasswordDto.prototype, "room_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProtectedPasswordDto.prototype, "new_password", void 0);
exports.UpdateProtectedPasswordDto = UpdateProtectedPasswordDto;
class UpdatePlayerDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlayerDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlayerDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePlayerDto.prototype, "password", void 0);
exports.UpdatePlayerDto = UpdatePlayerDto;
//# sourceMappingURL=updatePlayer.dto.js.map