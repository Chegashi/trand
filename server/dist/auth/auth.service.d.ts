import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    findORcreate(data: any): Promise<import(".prisma/client").Player>;
    findById(PlayerId: string): Promise<import(".prisma/client").Player>;
    generateQrCode(playerId: string): Promise<{
        otpauth_url: string;
    }>;
    JwtAccessToken(playerId: string): Promise<string>;
}
