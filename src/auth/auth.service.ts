import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './jwt.strategy';
import { User } from '@prisma/client';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private userService: UserService, private jwtService:JwtService){}

    private _createToken(payload:any){
        const token = this.jwtService.sign(payload);
        return {
            expiresIn: process.env.EXPIRESIN,
            token,
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        const user = await this.userService.findByPayload(payload);
        if (!user) {
            throw new HttpException("INVALID_TOKEN", 
               HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async login(dto: LoginDto): Promise<any>{
        const user = await this.userService.findByEmail(dto.email)

        if(!this.userService.comparePassword(dto.password, user.password)) throw new HttpException("Username or password is Wrong!", HttpStatus.UNAUTHORIZED)

        const payload = {
            id: user.id,
            email: user.email
        }
        const token = this._createToken(payload)

        return {
            ...token,
            data: user
        }
    }
}


export interface RegistrationStatus{
    success: boolean;
    message: string;
    data?: User;
}
export interface RegistrationSeederStatus {
    success: boolean;
    message: string;
    data?: User[];
}
