import {ApiProperty} from "@nestjs/swagger";
import { Player } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MutePlayerInRoomDto {
    @ApiProperty()
    @IsNotEmpty()  room_id: string;

    @ApiProperty()
    @IsNotEmpty()   time: number;

    @ApiProperty()
    @IsNotEmpty()  login: string;
}

export class CreateProtectedRoomDto {
    @ApiProperty()
    @IsNotEmpty()  name: string;

    @ApiProperty()
    @IsNotEmpty()   pwd: string;
}

export class SetPwdToPublicChatRoomDto {
    @ApiProperty()
    @IsNotEmpty() room_id: string;

    @ApiProperty()
    @IsNotEmpty() pwd: string;
}

export class JoinProtectedRoomDto {
    @ApiProperty()
    @IsNotEmpty()  room_id: string;

    @ApiProperty()
    @IsNotEmpty()  pwd: string;
}

export class UpdateProtectedPasswordDto {
    @ApiProperty()
    @IsNotEmpty()  room_id: string;    

    @IsNotEmpty()
    @ApiProperty() new_password: string;

}

export class  UpdatePlayerDto implements Partial<Player> {
    
    
    @IsString()
    nickname: string;
    @IsString()
    avatar: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password:string;


    // @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly name : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly email : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly phone : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly ranking : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly position : string ; }
    // constructor(parameters) {
        
    // }

}