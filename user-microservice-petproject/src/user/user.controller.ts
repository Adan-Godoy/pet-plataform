import { Controller } from '@nestjs/common';
import { GrpcMethod} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @GrpcMethod('UserService', 'Register')
    async register(data) {
        return this.userService.register(data);
    }

    @GrpcMethod('UserService', 'Login')
    async login(data) {
        return this.userService.login(data);
    }

    @GrpcMethod('UserService', 'GetProfile')
    async getProfile(data) {
        return this.userService.getProfile(data);
    }
    
    @GrpcMethod('UserService', 'UpdateUser')
    async updateUser(data) {
    return this.userService.updateUser(data.id, data);
    }

    @GrpcMethod('UserService', 'DeleteUser')
    async deleteUser(data) {
        return this.userService.deleteUser(data.id);
    }
}
