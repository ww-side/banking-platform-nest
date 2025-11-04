import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hash } from '~/shared/utils/hashing';

import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from './dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email "${data.email}" already exists`,
      );
    }

    const hashedPassword = await hash(data.password);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return new UserResponseDTO(await this.userRepository.save(user));
  }

  async findAll() {
    return (await this.userRepository.find()).map(
      (user) => new UserResponseDTO(user),
    );
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return new UserResponseDTO(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return new UserResponseDTO(user);
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.findOne(id);
    return new UserResponseDTO(
      await this.userRepository.save({ ...user, ...data }),
    );
  }

  async delete(id: string) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return { message: 'User deleted successfully' };
  }
}
