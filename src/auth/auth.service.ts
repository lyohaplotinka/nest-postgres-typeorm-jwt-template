import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../users/DTO/create-user.dto';
import { UserEntity } from '../users/user.entity';
import { Errors } from '../resources/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (user) {
      if (!(await argon2.verify(user.password, password)))
        throw new UnauthorizedException(Errors.unauthorized);
      const { password: hashPassword, ...result } = user;
      return result;
    }
    return null;
  }

  public async registerUser(
    userDTO: CreateUserDto,
  ): Promise<Partial<UserEntity>> {
    const { password, ...userPayload } = await this.usersService.createUser({
      email: userDTO.email,
      password: await argon2.hash(userDTO.password),
    });
    return userPayload;
  }

  public async login(user: any) {
    const payload = {
      login: user.email,
      userId: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
