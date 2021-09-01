import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserInterface } from './users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import { Errors } from '../resources/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async findUser(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  public async createUser(createUserDTO: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.userRepository.save(createUserDTO);
    } catch (e) {
      if (e.code === '23505')
        throw new ConflictException(Errors.userAlreadyExists);
      throw new InternalServerErrorException(Errors.unkownServerError);
    }
  }
}
