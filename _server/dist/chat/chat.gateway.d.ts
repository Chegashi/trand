import { Socket } from "socket.io";
import { PlayerService } from "src/player/player.service";
export declare class ChatGateway {
    private readonly playerservice;
    wss: Socket;
    private roomPrefix;
    constructor(playerservice: PlayerService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleJoinRoom(client: Socket, data: any): Promise<void>;
    handleMessage(client: Socket, data: any): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
}
