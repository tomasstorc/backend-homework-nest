import { Body, Controller, HttpCode, Post } from '@nestjs/common';

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
  @HttpCode(200)
  async login(@Body() loginUserDto: CreateUserDto) {
    const token = await this.userService.login(loginUserDto);
    return { request: loginUserDto, token };
  }
}
