import { Response } from 'express';
import { AuthService } from './auth.service';
import { VeriftyTfaDto } from './dtos/tfa.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    authentication(): Promise<void>;
    login(request: any, res: Response): Promise<void>;
    enable2fa(request: any, res: any): Promise<any>;
    verify2fa(body: VeriftyTfaDto, request: any, res: Response): Promise<void>;
    logout(request: any, res: Response): Promise<void>;
}
