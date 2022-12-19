import { Socket } from "socket.io";
import { PlayerService } from "src/player/player.service";
export declare class EventsGateway {
    private readonly playerservice;
    constructor(playerservice: PlayerService);
    wss: Socket;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleOnlineUsers(client: Socket, data: any): Promise<void>;
}
