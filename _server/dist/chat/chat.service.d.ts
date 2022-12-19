import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/chat.entity';
export declare class MessagesService {
    messages: Message[];
    ClientToUser: {};
    identify(name: string, clientId: string): unknown[];
    getClientName(clientId: string): any;
    create(createMessageDto: CreateMessageDto, clientId: string): {
        name: any;
        text: string;
    };
    findAll(): Message[];
}
