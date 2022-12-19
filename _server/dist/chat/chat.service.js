"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
let MessagesService = class MessagesService {
    constructor() {
        this.messages = [];
        this.ClientToUser = {};
    }
    identify(name, clientId) {
        this.ClientToUser[clientId] = name;
        return Object.values(this.ClientToUser);
    }
    getClientName(clientId) {
        return this.ClientToUser[clientId];
    }
    create(createMessageDto, clientId) {
        const message = {
            name: this.ClientToUser[clientId],
            text: createMessageDto.text,
        };
        this.messages.push(message);
        return message;
    }
    findAll() {
        console.log();
        return this.messages;
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=chat.service.js.map