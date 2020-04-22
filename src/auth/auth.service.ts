import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {InjectRepository} from '@nestjs/typeorm';
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtService} from '@nestjs/jwt';
import {JwtPayload} from "./jwt-payload.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
    }


    signUp = async (authCredentialsDto: AuthCredentialsDto): Promise<void> =>
        this.userRepository.signUp(authCredentialsDto);


    signIn = async (authCredentialsDto: AuthCredentialsDto): Promise<string> => {
        const username = await this.userRepository.validatePassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials')
        }
        const payload: JwtPayload = {username}
        return await this.jwtService.sign(payload)
    }


}
