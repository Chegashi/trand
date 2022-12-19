import { Player } from "@prisma/client";
export declare class MutePlayerInRoomDto {
    room_id: string;
    time: number;
    login: string;
}
export declare class CreateProtectedRoomDto {
    name: string;
    pwd: string;
}
export declare class SetPwdToPublicChatRoomDto {
    room_id: string;
    pwd: string;
}
export declare class JoinProtectedRoomDto {
    room_id: string;
    pwd: string;
}
export declare class UpdateProtectedPasswordDto {
    room_id: string;
    new_password: string;
}
export declare class UpdatePlayerDto implements Partial<Player> {
    nickname: string;
    avatar: string;
    password: string;
}
