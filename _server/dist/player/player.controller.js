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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const qrcode_1 = require("qrcode");
const multer_1 = require("multer");
const player_service_1 = require("./player.service");
const passport_1 = require("@nestjs/passport");
const updatePlayer_dto_1 = require("./dtos/updatePlayer.dto");
const path_1 = require("path");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async enable2fa(request, res) {
        const { otpauth_url } = await this.playerService.generate2faSecret(request.user.playerId);
        res.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return (0, qrcode_1.toFileStream)(res, otpauth_url);
    }
    async disable2fa(request, res) {
        console.log("disable2fa");
        const user = await this.playerService.disable2fa(request.user.playerId);
        return res.send({
            "message": "2FA disabled"
        });
    }
    async login(request, response) {
        const profile = await this.playerService.findPlayerById(request.user.playerId);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(profile);
    }
    async updateNickname(request, body, response) {
        console.log(body.nickname, " ", request.user.playerId);
        const user = await this.playerService.findPlayerById(request.user.playerId);
        const profile = await this.playerService.updateNickname(request.user.playerId, body.nickname);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(profile);
    }
    async upload(request, response, file) {
        const new_avatar = await this.playerService.uploadAvatar(request.user.playerId, file);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            image_url: new_avatar.avatar
        });
    }
    async getProfile(nickname, request, response) {
        const profile = await this.playerService.findPlayerByNickname(nickname['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(profile);
    }
    async isBlocked(login, request, response) {
        const isFriend = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
        if (isFriend && isFriend.status === "Block") {
            response.status(200).send(true);
        }
        else {
            response.status(200).send(false);
        }
    }
    async checkStatusFriendship(login, request, response) {
        const membership = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
        let choices = [];
        if (!membership) {
            choices = ['addFriend'];
        }
        else if (membership && membership.status === "Friend") {
            choices = ['blockFriend'];
        }
        else if (membership && membership.status === "Block" && membership.senderId === request.user.playerId) {
            choices = ['unblockFriend'];
        }
        else if (membership && membership.status === "Block" && membership.receiverId === request.user.playerId) {
            choices = ['YourBlocked'];
        }
        else if (membership && membership.status === "Pending" && membership.senderId === request.user.playerId) {
            choices = ['pendingFriend'];
        }
        else if (membership && membership.status === "Pending" && membership.receiverId === request.user.playerId) {
            choices = ['acceptFriend', 'refuseFriend'];
        }
        else {
            choices = [''];
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(choices);
    }
    async RequestFriendship(login, request, response) {
        const room = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
        if (room) {
            throw new common_1.UnauthorizedException("Already Exist");
        }
        const friend = await this.playerService.createFriendship(request.user.playerId, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship request sent"
        });
    }
    async AcceptFriendship(login, request, response) {
        const friend = await this.playerService.acceptFriendship(request.user.playerId, login['id']);
        const room = await this.playerService.getRoomBetweenTwoPlayers(request.user.playerId, login['id']);
        if (room === null) {
            await this.playerService.createDMRoom(request.user.playerId, login['id']);
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship Accepted"
        });
    }
    async RefuseFriendship(login, request, response) {
        const room = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
        if (room === null) {
            throw new common_1.UnauthorizedException("There is no Request to refuse");
        }
        const friend = await this.playerService.refuseFriendship(request.user.playerId, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship refused"
        });
    }
    async BlockFriendship(login, request, response) {
        const friend = await this.playerService.blockFriendship(request.user.playerId, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship blocked"
        });
    }
    async UnblockFriendship(login, request, response) {
        const room = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
        if (room === null) {
            throw new common_1.UnauthorizedException("There is no friendship to Unblock");
        }
        const friend = await this.playerService.deleteFriendship(request.user.playerId, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship unblocked"
        });
    }
    async GetListOfFriends(request, response) {
        const friends = await this.playerService.getAllFriends(request.user.playerId);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async GetListOfMembers(id_room, request, response) {
        console.log("List of Members id_room", id_room['id']);
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permision = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permision === null) {
            throw new common_1.NotFoundException("You are not in this room");
        }
        const friends = await this.playerService.getProfilesOfChatRooms(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async GetListOfAddFriends(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permision = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permision === null) {
            throw new common_1.NotFoundException("You are not in this room");
        }
        const friends = await this.playerService.getListOfFriendsToAddinThisRoom(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async addMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status) {
            throw new common_1.NotFoundException("This player is already a member of this room");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (!admin) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin && admin.statusMember === "member" && room.is_private === true) {
            throw new common_1.NotFoundException("It's a private room and you don't have the permission to add a member");
        }
        await this.playerService.addMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.send({
            message: "Member added"
        });
    }
    async GetListOfSetAdmin(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permission = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permission === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (permission.statusMember === "member") {
            throw new common_1.NotFoundException("You are not an admin or owner of this room");
        }
        const friends = await this.playerService.getListOfFriendsToUpgradeAdmininThisRoom(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async setAdmin(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (!status) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status.statusMember !== "member" || status.is_banned === true) {
            throw new common_1.NotFoundException("Cannot set this player as Admin bcuz is not a member and maybe he is muted or banned");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (!admin) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot set this player as Admin, you are not the Owner");
        }
        const result = await this.playerService.setAdmin(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Admin set"
        });
    }
    async unsetAdmin(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (!status) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status.statusMember !== "admin" || status.is_banned === true) {
            throw new common_1.NotFoundException("This player is not an admin or is banned");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (!admin) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot unset this player from Admin position, you are not the Owner");
        }
        const result = await this.playerService.unsetAdmin(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Admin set"
        });
    }
    async GetListOfMembersToMute(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permision = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permision === null) {
            throw new common_1.NotFoundException("You are not in this room");
        }
        const friends = await this.playerService.getListOfFriendsToMuteinThisRoom(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async muteMember(Body, request, response) {
        console.log("Body.room_id", Body.room_id);
        console.log("Body.time", Body.time);
        console.log("Body.login", Body.login);
        const room = await this.playerService.findRoomById(Body.room_id);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(Body.login);
        const status = await this.playerService.getPermissions(member.id, Body.room_id);
        if (!status) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status && status.is_muted == true) {
            throw new common_1.NotFoundException("Cannot mute this player bcuz he is muted");
        }
        if (status && status.is_banned == true) {
            throw new common_1.NotFoundException("Cannot mute this player bcuz he is banned");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, Body.room_id);
        if (!admin) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        console.log("admin.statusMember", admin.statusMember);
        if (admin && admin.statusMember === "member") {
            throw new common_1.NotFoundException("You cannot mute this player, bcuz you're not admin or owner");
        }
        if (admin && admin.statusMember === "admin" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("You cannot mute the owner");
        }
        if (admin && admin.statusMember === "admin" && status.statusMember === "admin") {
            throw new common_1.NotFoundException("You cannot mute another admin");
        }
        if (admin && admin.statusMember === "owner" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("The owner cannot mute himself");
        }
        const mute = await this.playerService.muteMember(Body.login, Body.room_id, Body.time);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member muted"
        });
    }
    async GetListOfMembersToUnmute(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permision = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permision === null) {
            throw new common_1.NotFoundException("You are not in this room");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot unmute this player");
        }
        const friends = await this.playerService.getListOfFriendsToUnmuteinThisRoom(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async unmuteMember(nickname, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(nickname['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status && status.is_muted === false) {
            throw new common_1.NotFoundException("This player is not muted");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember === "member") {
            throw new common_1.NotFoundException("You cannot unmute this player, bcuz you're not admin or owner");
        }
        if (admin.statusMember === "admin" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("You cannot unmute the owner");
        }
        if (admin.statusMember === "admin" && status.statusMember === "admin") {
            throw new common_1.NotFoundException("You cannot unmute another admin");
        }
        const mute = await this.playerService.unmuteMember(nickname['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member unmuted"
        });
    }
    async GetListOfMembersToBan(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const permision = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permision === null) {
            throw new common_1.NotFoundException("You are not in this room");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot unmute this player");
        }
        const friends = await this.playerService.getListOfFriendsToBaninThisRoom(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async banMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status && status.is_banned === true) {
            throw new common_1.NotFoundException("This player is already banned");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember === "member") {
            throw new common_1.NotFoundException("You cannot ban this player, bcuz you're not admin or owner");
        }
        if (admin.statusMember === "admin" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("You cannot ban the owner");
        }
        if (admin.statusMember === "admin" && status.statusMember === "admin") {
            throw new common_1.NotFoundException("You cannot ban another admin");
        }
        if (admin.statusMember === "owner" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("owner can not ban himself");
        }
        const ban = await this.playerService.banMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member banned"
        });
    }
    async kickMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("It's a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("This player is not a member of this room");
        }
        if (status && status.is_banned === true) {
            throw new common_1.NotFoundException("Cannot kick this player, bcuz he is banned from this room");
        }
        const admin = await this.playerService.getPermissions(request.user.playerId, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("Cannot kick this player");
        }
        if (admin && admin.statusMember === "member") {
            throw new common_1.NotFoundException("You cannot kick this player, bcuz you're not admin or owner");
        }
        if (admin && admin.statusMember === "admin" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("You cannot kcik the owner");
        }
        if (admin && admin.statusMember === "admin" && status.statusMember === "admin") {
            throw new common_1.NotFoundException("You cannot kick another admin");
        }
        if (admin && admin.statusMember === "owner" && status.statusMember === "owner") {
            throw new common_1.NotFoundException("The owner cannot kick himself");
        }
        const kick = await this.playerService.kickMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member kicked"
        });
    }
    async GetPermission(id_room, request, response) {
        const permission = await this.playerService.getPermissions(request.user.playerId, id_room['id']);
        if (permission == null) {
            throw new common_1.NotFoundException("Permission denied, you are not a member of this room");
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(permission);
    }
    async GetListOfRooms(request, response) {
        const rooms = await this.playerService.getAllRooms(request.user.playerId);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(rooms);
    }
    async CreatePublicChatRoom(Body, request, response) {
        console.log("request  ", request.user);
        const room = await this.playerService.createPublicChatRoom(request.user.playerId, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async SetPwdToPublicChatRoom(Body, request, response) {
        const room = await this.playerService.SetPwdToPublicChatRoom(request.user.playerId, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async CreatePrivateChatRoom(Body, request, response) {
        const room = await this.playerService.createPrivateChatRoom(request.user.playerId, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async CreateProtectedChatRoom(Body, request, response) {
        const room = await this.playerService.createProtectedChatRoom(request.user.playerId, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async UpdatePwdProtectedChatRoom(Body, request, response) {
        console.log("Body.room_id : ", Body.room_id);
        console.log("Body.new_password : ", Body.new_password);
        const room = await this.playerService.UpdatePwdProtectedChatRoom(request.user.playerId, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async DeletePwdProtectedChatRoom(Body, request, response) {
        const room = await this.playerService.DeletePwdToProtectedChatRoom(request.user.playerId, Body.room_id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async GetTypeOfRoom(id_room, request, response) {
        const type = await this.playerService.getTypeOfRoom(id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(type);
    }
    async GetRoomById(id_room, request, response) {
        const room = await this.playerService.getRoomById(request.user.playerId, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async leaveRoom(room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Cannot leave a DM");
        }
        const member = await this.playerService.getPermissions(request.user.playerId, room_id['id']);
        const leave = await this.playerService.leaveChannel(request.user.playerId, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Room leaved"
        });
    }
    async getMessages(room_id, request, response) {
        console.log("get Messages id_room", room_id['id']);
        const room = await this.playerService.findRoomById(room_id['id']);
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        const messages = await this.playerService.getMessagesOfRoom(request.user.playerId, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(messages);
    }
    async SendMessageButton(login, request, response) {
        console.log("Send Message");
        const user = await this.playerService.findPlayerByNickname(login['id']);
        let room = null;
        room = await this.playerService.getRoomBetweenTwoPlayers(request.user.playerId, login['id']);
        if (room === null) {
            const friendship = await this.playerService.getFriendshipStatus(request.user.playerId, login['id']);
            if (!friendship) {
                room = await this.playerService.createDMRoom(request.user.playerId, login['id']);
            }
            else if (friendship.status === 'Pending') {
                room = await this.playerService.createDMRoom(request.user.playerId, login['id']);
            }
            else if (friendship.status === 'Block') {
                throw new common_1.NotFoundException("You can not send a message to this player");
            }
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room.id);
    }
    async joinRoom(room_id, request, response) {
        const join = await this.playerService.joinRoom(request.user.playerId, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({
            message: "Player joined the room successfully"
        });
    }
    async joinDM(room_id, request, response) {
        console.log("Join DM, login: ", room_id['id']);
        const room = await this.playerService.joinDM(request.user.playerId, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ room });
    }
    async joinNonProtectedRoom(room_id, request, response) {
        const room = await this.playerService.joinRoom(request.user.playerId, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ room });
    }
    async joinProtectedRoom(roomId_pwd, request, response) {
        const room = await this.playerService.joinProtectedRoom(request.user.playerId, roomId_pwd);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ room });
    }
    async allGameHistory(request, response) {
        const history = await this.playerService.getAllGamesHistory();
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ history });
    }
    async gameHistoryById(id, request, response) {
        const history = await this.playerService.getGamesHistoryByUser(id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ history });
    }
    async achivement(id, request, response) {
        const getAchivements = await this.playerService.getAchivements(id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({ getAchivements });
    }
};
__decorate([
    (0, common_1.Get)('/2fa/enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "enable2fa", null);
__decorate([
    (0, common_1.Get)('/2fa/disable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "disable2fa", null);
__decorate([
    (0, common_1.Get)('myprofile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('update/nickname'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.Post)('update/avatar'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, uniqueSuffix + ext);
            }
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_2.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            new common_1.MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('/profile/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/isBlock/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "isBlocked", null);
__decorate([
    (0, common_1.Get)('/statusFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "checkStatusFriendship", null);
__decorate([
    (0, common_1.Get)('/requestFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "RequestFriendship", null);
__decorate([
    (0, common_1.Get)('/acceptFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "AcceptFriendship", null);
__decorate([
    (0, common_1.Get)('/refuseFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "RefuseFriendship", null);
__decorate([
    (0, common_1.Get)('/blockFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "BlockFriendship", null);
__decorate([
    (0, common_1.Get)('/unblockFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "UnblockFriendship", null);
__decorate([
    (0, common_1.Get)('/listOfFriends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfFriends", null);
__decorate([
    (0, common_1.Get)('/listOfMembers/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembers", null);
__decorate([
    (0, common_1.Get)('/listToAddFriend/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfAddFriends", null);
__decorate([
    (0, common_1.Get)('/addMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)('/listOfSetAdmin/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfSetAdmin", null);
__decorate([
    (0, common_1.Get)('/setAdmin/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "setAdmin", null);
__decorate([
    (0, common_1.Get)('/unsetAdmin/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "unsetAdmin", null);
__decorate([
    (0, common_1.Get)('/listToMute/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToMute", null);
__decorate([
    (0, common_1.Post)('/muteMember'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatePlayer_dto_1.MutePlayerInRoomDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "muteMember", null);
__decorate([
    (0, common_1.Get)('/listOfUnmute/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToUnmute", null);
__decorate([
    (0, common_1.Get)('/unmuteMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "unmuteMember", null);
__decorate([
    (0, common_1.Get)('/listToBan/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToBan", null);
__decorate([
    (0, common_1.Get)('/banMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "banMember", null);
__decorate([
    (0, common_1.Get)('/kickMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "kickMember", null);
__decorate([
    (0, common_1.Get)('/Permission/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetPermission", null);
__decorate([
    (0, common_1.Get)('/listOfRooms'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfRooms", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Public'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreatePublicChatRoom", null);
__decorate([
    (0, common_1.Post)('/SetPwdToPublicChatRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatePlayer_dto_1.SetPwdToPublicChatRoomDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "SetPwdToPublicChatRoom", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Private'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreatePrivateChatRoom", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Protected'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatePlayer_dto_1.CreateProtectedRoomDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreateProtectedChatRoom", null);
__decorate([
    (0, common_1.Post)('/UpdatePwdProtectedChatRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatePlayer_dto_1.UpdateProtectedPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "UpdatePwdProtectedChatRoom", null);
__decorate([
    (0, common_1.Post)('/DeletePwdProtectedChatRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "DeletePwdProtectedChatRoom", null);
__decorate([
    (0, common_1.Get)('/GetTypeOfRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetTypeOfRoom", null);
__decorate([
    (0, common_1.Get)('/GetRoomById/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetRoomById", null);
__decorate([
    (0, common_1.Get)('/leaveRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Get)('/getmessages/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('/sendMessageButton/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "SendMessageButton", null);
__decorate([
    (0, common_1.Get)('/joinRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Get)('joinDM/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "joinDM", null);
__decorate([
    (0, common_1.Get)('/joinNonProtectedRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "joinNonProtectedRoom", null);
__decorate([
    (0, common_1.Post)('/joinProtectedRoom'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatePlayer_dto_1.JoinProtectedRoomDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "joinProtectedRoom", null);
__decorate([
    (0, common_1.Get)('/allGameHistory'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "allGameHistory", null);
__decorate([
    (0, common_1.Get)('/gameHistoryById/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "gameHistoryById", null);
__decorate([
    (0, common_1.Get)('/achivement/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "achivement", null);
PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
exports.PlayerController = PlayerController;
//# sourceMappingURL=player.controller.js.map