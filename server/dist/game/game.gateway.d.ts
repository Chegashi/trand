import { Socket } from "socket.io";
import { GameService } from './game.service';
export declare class GameGateway {
    private readonly gameService;
    wss: Socket;
    private roomPrefix;
    private PlayersInQueue;
    constructor(gameService: GameService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleNewPlayer(client: Socket, user: any): Promise<void>;
    handleUpdate(client: Socket, user: any): Promise<void>;
    handleLeaveGameAsPlayer(client: Socket, data: any): Promise<void>;
}
