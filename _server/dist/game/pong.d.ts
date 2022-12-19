export default class pong {
    gameId: string;
    player_left: any;
    player_right: any;
    ball: any;
    music: string;
    spectators: any;
    isPlaying: boolean;
    losses: any;
    constructor(gameId: string, player1: any, player2: any);
    reset_ball(): void;
    collison(player: any): boolean;
    onUpdate(playerId: string, position_2: number): any;
    update(user: any): any;
    getPongData(playerId?: any): any;
    getGameHistory(): any;
}
