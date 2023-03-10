/// <reference types="multer" />
import { PlayerService } from './player.service';
import { MutePlayerInRoomDto, CreateProtectedRoomDto, JoinProtectedRoomDto, SetPwdToPublicChatRoomDto, UpdateProtectedPasswordDto } from './dtos/updatePlayer.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    enable2fa(request: any, res: any): Promise<any>;
    disable2fa(request: any, res: any): Promise<any>;
    login(request: any, response: any): Promise<void>;
    updateNickname(request: any, body: any, response: any): Promise<void>;
    upload(request: any, response: any, file: Express.Multer.File): Promise<void>;
    getProfile(nickname: string, request: any, response: any): Promise<void>;
    isBlocked(login: string, request: any, response: any): Promise<void>;
    checkStatusFriendship(login: string, request: any, response: any): Promise<void>;
    RequestFriendship(login: string, request: any, response: any): Promise<void>;
    AcceptFriendship(login: string, request: any, response: any): Promise<void>;
    RefuseFriendship(login: string, request: any, response: any): Promise<void>;
    BlockFriendship(login: string, request: any, response: any): Promise<void>;
    UnblockFriendship(login: string, request: any, response: any): Promise<void>;
    GetListOfFriends(request: any, response: any): Promise<void>;
    GetListOfMembers(id_room: string, request: any, response: any): Promise<void>;
    GetListOfAddFriends(id_room: string, request: any, response: any): Promise<void>;
    addMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfSetAdmin(id_room: string, request: any, response: any): Promise<void>;
    setAdmin(login: string, room_id: string, request: any, response: any): Promise<void>;
    unsetAdmin(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfMembersToMute(id_room: string, request: any, response: any): Promise<void>;
    muteMember(Body: MutePlayerInRoomDto, request: any, response: any): Promise<void>;
    GetListOfMembersToUnmute(id_room: string, request: any, response: any): Promise<void>;
    unmuteMember(nickname: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfMembersToBan(id_room: string, request: any, response: any): Promise<void>;
    banMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    kickMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetPermission(id_room: string, request: any, response: any): Promise<void>;
    GetListOfRooms(request: any, response: any): Promise<void>;
    CreatePublicChatRoom(Body: any, request: any, response: any): Promise<void>;
    SetPwdToPublicChatRoom(Body: SetPwdToPublicChatRoomDto, request: any, response: any): Promise<void>;
    CreatePrivateChatRoom(Body: any, request: any, response: any): Promise<void>;
    CreateProtectedChatRoom(Body: CreateProtectedRoomDto, request: any, response: any): Promise<void>;
    UpdatePwdProtectedChatRoom(Body: UpdateProtectedPasswordDto, request: any, response: any): Promise<void>;
    DeletePwdProtectedChatRoom(Body: any, request: any, response: any): Promise<void>;
    GetTypeOfRoom(id_room: string, request: any, response: any): Promise<void>;
    GetRoomById(id_room: string, request: any, response: any): Promise<void>;
    leaveRoom(room_id: string, request: any, response: any): Promise<void>;
    getMessages(room_id: string, request: any, response: any): Promise<void>;
    SendMessageButton(login: string, request: any, response: any): Promise<void>;
    joinRoom(room_id: string, request: any, response: any): Promise<any>;
    joinDM(room_id: string, request: any, response: any): Promise<any>;
    joinNonProtectedRoom(room_id: string, request: any, response: any): Promise<any>;
    joinProtectedRoom(roomId_pwd: JoinProtectedRoomDto, request: any, response: any): Promise<any>;
    allGameHistory(request: any, response: any): Promise<any>;
    gameHistoryById(id: string, request: any, response: any): Promise<any>;
    achivement(id: string, request: any, response: any): Promise<any>;
}
