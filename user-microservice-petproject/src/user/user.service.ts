import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(data: { email: string; password: string; name: string; lastName: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
        email: data.email,
        name: data.name,
        lastName: data.lastName,
        password: hashed,
    });
    await this.userRepo.save(user);
    return { id: user.id, email: user.email, name: user.name, lastName: user.lastName };
    }

    async login(data: { email: string; password: string }) {
        const user = await this.userRepo.findOne({ where: { email: data.email } });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
        }
        const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
        return { accessToken: token };
    }

    async getProfile(data: { userId: string }) {
        const user = await this.userRepo.findOne({ where: { id: data.userId } });
        if (!user) throw new NotFoundException('User not found');
        return { id: user.id, email: user.email, name: user.name };
    }

    async updateUser(id: string, data: any) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    if (data.name !== undefined) user.name = data.name;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.email !== undefined) user.email = data.email;
    if (data.password !== undefined) {
        user.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepo.save(user);

    return {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
    };
    }

    async deleteUser(id: string) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('User not found');
        await this.userRepo.remove(user);
        return { message: 'User deleted successfully' };
    }

}
