"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const width = 600;
const height = 400;
class pong {
    constructor(gameId, player1, player2) {
        this.spectators = new Set();
        this.gameId = gameId;
        this.ball = {
            x: width / 2,
            y: height / 2,
            radius: 10,
            speed: 11,
            velocity_X: 5,
            velocity_Y: 5,
        };
        this.player_left = {
            id: player1,
            x: 0,
            y: (height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
        };
        this.player_right = {
            id: player2,
            x: width - 10,
            y: (height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
        };
        this.music = '';
    }
    reset_ball() {
        this.ball.x = width / 2;
        this.ball.y = height / 2;
        this.ball.speed = 11;
        this.ball.velocity_X *= -1;
    }
    collison(player) {
        return (player.x < this.ball.x + this.ball.radius &&
            player.x + player.width > this.ball.x - this.ball.radius &&
            player.y < this.ball.y + this.ball.radius &&
            player.y + player.height > this.ball.y - this.ball.radius);
    }
    onUpdate(playerId, position_2) {
        if (playerId === this.player_left.id) {
            this.player_left.y = position_2 * height;
        }
        else if (playerId === this.player_right.id) {
            this.player_right.y = position_2 * height;
        }
    }
    update(user) {
        this.music = '';
        if (this.ball.x - this.ball.radius < 0) {
            this.player_right.score++;
            this.reset_ball();
            this.music = 'right';
        }
        else if (this.ball.x + this.ball.radius > width) {
            this.player_left.score++;
            this.reset_ball();
            this.music = 'left';
        }
        this.ball.x += this.ball.velocity_X;
        this.ball.y += this.ball.velocity_Y;
        if (this.ball.y < this.ball.radius ||
            this.ball.y + this.ball.radius > height) {
            this.ball.velocity_Y *= -1;
            this.music = 'wall';
        }
        const player = this.ball.x < width / 2 ? this.player_left : this.player_right;
        if (this.collison(player)) {
            this.music = 'hit';
            let collide_point = this.ball.y - (player.y + player.height / 2);
            collide_point = collide_point / (player.height / 2);
            const angle_rad = (Math.PI / 4) * collide_point;
            const direction = this.ball.x + this.ball.radius < width / 2 ? 1 : -1;
            this.ball.velocity_X = direction * this.ball.speed * Math.cos(angle_rad);
            this.ball.velocity_Y = this.ball.speed * Math.sin(angle_rad);
            this.ball.speed += 0.3;
        }
        return this.getPongData(user);
    }
    getPongData(playerId = null) {
        let userRool;
        if (playerId === this.player_left.id)
            userRool = 'left';
        else if (playerId === this.player_right.id)
            userRool = 'right';
        else
            userRool = 'watcher';
        return {
            gameId: this.gameId,
            playerLeft: {
                name: this.player_left.id,
                position: this.player_left.y / height,
                score: this.player_left.score,
            },
            playerRight: {
                name: this.player_right.id,
                position: this.player_right.y / height,
                score: this.player_right.score,
            },
            ball: {
                x: this.ball.x / width,
                y: this.ball.y / height,
            },
            isPlaying: this.player_left.score < 5 && this.player_right.score < 5,
            musicIndice: this.music,
            userRool: userRool,
        };
    }
}
exports.default = pong;
//# sourceMappingURL=pong.js.map