import { Body, Controller, Get, Post } from '@nestjs/common';
import IUser from './interfaces/user';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.userService.registerUser(createUserDto);
    return createUserDto;
  }

  @Post('login')
  async login(@Body() loginUserDto: CreateUserDto) {
    const token = await this.userService.login(loginUserDto);
    return { request: loginUserDto, token };
  }
}
