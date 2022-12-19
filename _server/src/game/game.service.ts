import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma.service';
import Pong from './pong';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

// import { Player } from '@prisma/client';
import { Socket } from 'socket.io';
import pong from './pong';

const replacerFunc = () => {
  const visited = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

@Injectable()
export class GameService {
  private games: Map<string, Pong> = new Map();
  private queue: any[] = [];
  private PlayersGames: any = [];
  private currentGames: any = [];
  private invitationGames:Map<any, any> = new Map()
  private prisma: PrismaService = new PrismaService();

  private WatchersGames: any = [];
  private roomPrefix = 'roomGameSocket';

  newPlayer(client: Socket, user: any): any {
    console.log('Adding a new Player.', user);
    this.queue.push({ user: user, client });
    // console.log('this is the)
    if (this.queue.length === 2) {
      const gameId = uuidv4();
      console.log('QUEUE IS FULL .');

      const playerLeft = this.queue.shift();
      const playerRight = this.queue.shift();
      const game = new Pong(
        gameId,
        JSON.parse(playerLeft.user).nickname,
        JSON.parse(playerRight.user).nickname,
      );
      this.games.set(gameId, game);
      this.PlayersGames[playerLeft] = gameId;
      this.PlayersGames[playerRight] = gameId;
      this.currentGames[playerLeft.user] = gameId;
      this.currentGames[playerRight.user] = gameId;
      const LeftSock: Socket = playerLeft.client;
      const RightSock: Socket = playerRight.client;
      LeftSock.join(this.roomPrefix + gameId);
      RightSock.join(this.roomPrefix + gameId);
      // console.log('-----------------------------------------------');
      // console.log('PlayerLeft : ', playerLeft);
      // console.log('PlayerRight : ', playerRight);
      // console.log('-----------------------------------------------');
      // console.log('Game : ', game);
      //   playerLeft.client.join(this.roomPrefix + gameId);
      //   playerRight.client.join(this.roomPrefix + gameId);
      const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };
      // const PlayerLeftString = JSON.stringify(game.player_left, replacerFunc());
      // const PlayerRightString = JSON.stringify(game.player_right, replacerFunc());
      const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
      const rightData = JSON.stringify(game.update(game.player_right.id), replacerFunc());
      console.log(" => " , rightData)
      // console.log('gameId : ', gameId);
      LeftSock.to(this.roomPrefix + gameId).emit('matchFound', {
        // id: gameId,
        // player_left: PlayerLeftString,
        // player_right: PlayerRightString,
        // player_left: game.player_left.id,
        // player_right: game.player_right.id,
        pongData: pongData,
      });
      RightSock.to(this.roomPrefix + gameId).emit('matchFound', {
        // id: gameId,
        // player_left: this.games[gameId].player_left.id,
        // player_right: this.games[gameId].player_right.id,
        pongData: rightData,
      });
    }
    return { client: client, user: user };
  }

  update(client: Socket, user: any): any {
    // console.log("Inside  update ! " ,user.user);
    
    const parsed = JSON.parse(user.user);
    // console.log("Inside  Position ! " ,user.positon);

    // console.log("Parsed  update ! " ,user);
    const gameId = this.PlayersGames[user];
    // console.log("Update GameId ",gameId)
    const game = this.games.get(gameId);
    if (game) {

      // console.log("Sending the infos ! ",game)

     


  
      // const PlayerLeftString = JSON.stringify(game.player_left, replacerFunc());
      // const PlayerRightString = JSON.stringify(game.player_right, replacerFunc());

       // const LeftSock: Socket = game.player_left.id.client;
      // const RightSock: Socket = game.player_left.id.client;

         // LeftSock.to(this.roomPrefix + gameId).emit('update', {
      //   pongData:pongData
      // });
      // RightSock.to(this.roomPrefix + gameId).emit('update', 
      // {pongData:pongData});
      if(parsed.nickname == game.player_left.id)
      {
        // console.log("its left" + game.player_left.id)
      game.onUpdate(game.player_left.id,user.positon)

      }
      else if (parsed.nickname == game.player_right.id)
      {
        // console.log("its right" + game.player_right.id)

        game.onUpdate(game.player_right.id,user.positon)

      }
      const pongData = JSON.stringify(game.update(parsed.nickname), replacerFunc());
      
       client.to(this.roomPrefix + gameId).emit('update', {
        pongData:pongData
      });
      if (game.getPongData().isPlaying === false){
        this.gameHistory(game.getGameHistory())
        this.gameAchievements(game.getGameHistory());
        this.games.delete(game.gameId);
      }

    }
    // return game.update(user);
  }

  getAllGames(client:Socket): any{
    let games = [];

    this.games.forEach((game, key) => {
      games.push({
        id: key,
        player_left: game.player_left,
        player_right: game.player_right,
      });
    });

    client.emit('getAllGames', {
    games:games
      });
    return games;
  }

  watchGame(client: Socket, user:any, gameId:any): any {
    this.watchGame[user] = gameId;
    // console.log("USer infos ",user)

    // console.log("Game infos ",gameId)

    const game = this.games.get(gameId);
    if (game) {
      console.log("Game Exist Joining user" , game)
      console.log("User : ",user)
      const parsed = JSON.parse(user)
      client.join(this.roomPrefix + gameId);
      game.spectators.add(user);
      console.log("Before Pong Data ",user.nickname)
      const gameUpData = game.update(parsed.nickname);

      const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
      console.log("pongData => " ,pongData)
      client.emit('WatchUpdate', {
        pongData:pongData
      });
   
    }
    else if (!game)
    {
      console.log("Game not found !");
      client.emit('GameNotFound', {
        message:"Game Not found ! "
      });
   
    }
  }

  leaveGameAsWatcher(client: Socket, userId:any): void {
    const gameId = this.watchGame[userId];
    const game = this.games.get(gameId);
    if (game) {
      if (client.in(this.roomPrefix + gameId))
        client.leave(this.roomPrefix + gameId);
      game.spectators.delete(userId);
    }
  }

  leaveGameAsPlayer(client: Socket,user:any): void {
    console.log('-----------------------------------------------');
    console.log("User : ",user)
    const gameId = this.currentGames[user];
    const parsed = JSON.parse(user);

    // console.log("Inside PlayerGames",this.currentGames)
    // console.log('-----------------------------------------------');

  const nickname= parsed.nickname
    // const gameId = this.PlayersGames[user];

    console.log("Inside LeaveGameAsPlayer",gameId)

    const game = this.games.get(gameId);

    if (game) {
      // console.log("Game : ",game)
      // console.log(" => ",game.player_left.id )
      // console.log(" => ",game.player_right.id )
      // console.log(" => ", parsed.nickname)
      // console.log(" => ", nickname)

      if (game.player_left.id == nickname) {
         const pongData = JSON.stringify(game.update(game.player_right.id), replacerFunc());
         client.to(this.roomPrefix + gameId).emit('update', {
           ffs:true,
         leaver:game.player_left.id,
          pongData:pongData
        });
        // this.games.delete(gameId);
        console.log("Deleting the left ! " ,game.player_right.id)
        game.player_right.score = 20;
      }
      else if (game.player_right.id == nickname)
      {
      console.log("Deleting the right ! "   ,game.player_left.id)
      const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
      client.to(this.roomPrefix + gameId).emit('update', {
        ffs:true,
        leaver:game.player_right.id,
        pongData:pongData
      });
        // this.games.delete(gameId);
        game.player_right.score = 20;
      }
    }
    // client.id.client(this.roomPrefix + gameId).forEach((s: any) =>
    // {
    //   s.leave(this.roomPrefix + gameId);
    // })
    this.gameHistory(game.getGameHistory())
    this.gameAchievements(game.getGameHistory());
    this.games.delete(game.gameId);
    console.log('-----------------------------------------------');
  }

  inviteGame(client: Socket, user: any, inviteeNickname: string){
    const inviterNickname = user.nickname;
    this.invitationGames.set({inviterNickname, inviteeNickname},{ user: user, client })
  }

  acceptInvite(client: Socket, user: any, inviteeNickname: string){
    let userNickname = user.nickname;
    let invitation = this.invitationGames.get({userNickname, inviteeNickname});
    if (invitation){
      this.invitationGames.delete({userNickname, inviteeNickname});
      const gameId = uuidv4();
      console.log('an invitaion was accepted .');
      const playerRight = this.queue.shift();
      const game = new Pong(
        gameId,
        JSON.parse(invitation.user).nickname,
        JSON.parse(user).nickname,
      );
      this.games.set(gameId, game);
      this.PlayersGames[invitation.user] = gameId;
      this.PlayersGames[user] = gameId;
      this.currentGames[invitation.user] = gameId;
      this.currentGames[user] = gameId;
      const LeftSock: Socket = invitation.client;
      const RightSock: Socket = client;
      LeftSock.join(this.roomPrefix + gameId);
      RightSock.join(this.roomPrefix + gameId);
      const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
      const rightData = JSON.stringify(game.update(game.player_right.id), replacerFunc());
      console.log(" => " , rightData)
      // console.log('gameId : ', gameId);
      LeftSock.to(this.roomPrefix + gameId).emit('matchFound', {
        pongData: pongData,
      });
      RightSock.to(this.roomPrefix + gameId).emit('matchFound', {
        pongData: rightData,
      });
    }
  }
  async gameHistory(data:any){
    console.log('gameHistory findPlayerByNickname : ', data.winner)
    const _winner = await this.findPlayerByNickname(data.winner);
    const _loser = await this.findPlayerByNickname(data.loser);
    const game_history = await this.prisma.game_history.create({
      data: {
        winner_id : data.winner,
        winner_score : data.winnerScore,
        looser_id : data.loser,
        losser_score : data.loserScore,
      }
    })
  }

  async gameAchievements(data:any){
    console.log("this prisma achivemenvt", this.prisma.achievements)
    if (data.loserScore === 0){
      const CleanSheet = await this.prisma.achievements.create({
        data: {
          name : "Boono",
          playerId: data.winner,
        }
      });
    }
    const ziyach = await this.prisma.achievements.create({
      data: {
        name : "Ziyach",
        playerId : data.winner,
      }
    });
    const hamdaLlah = await this.prisma.achievements.create({
      data: {
        name : "Hamda Llah",
        playerId : data.loser,
      }
    })
  }

  async findPlayerById(userId: string)//: Promise<any> {
    {
        // console.log("FindPlayerById", userId);  // userId ===> roomId
        if (!userId) {
            // throw new HttpException('User Id is required', 400);
            throw new NotFoundException('User Id is required');
        }
       // deleted await cuz found deleting promise
        const player =  this.prisma.player.findUnique({
            where: {
                id: userId,
            }
        });
        if (!player) {
            throw new NotFoundException("User Id is not found")
            // throw new HttpException('User ÷ found', HttpStatus.NOT_FOUND);
        }
        return player;
  }
  async findPlayerByNickname(login: string) //: Promise<any> {
    {
      console.log('login', login);
        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!player) {
            throw new NotFoundException('Profile not found')
        }
        return player;
  }
}

