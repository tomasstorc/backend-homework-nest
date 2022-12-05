import { Model } from 'mongoose';
import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './schemas/User';
import jwt from 'jsonwebtoken';
import IUser from './interfaces/user';
import { hashSync, compareSync } from 'bcrypt';
import passwordValidator from 'password-validator';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly jwtService: JwtService,
  ) {}

  private validatePW(password: string): boolean | any[] {
    const schema = new passwordValidator();
    schema
      .is()
      .min(6, 'password must be atleast 6 characters long')
      .has()
      .uppercase(1, 'password must contain atleast one upper case letter')
      .has()
      .lowercase(1, 'password must contain atleast one lower case letter');

    return schema.validate(password);
  }

  async registerUser(userDto: IUser): Promise<User | string> {
    const user = await this.userModel.findOne({ email: userDto.email });
    if (user) {
      return 'user with provided email already exists';
    }
    const hashedPw = hashSync(userDto.password, 10);
    const newUser = new this.userModel({
      email: userDto.email,
      password: hashedPw,
    });
    return newUser.save();
  }
  async login(userDto: IUser): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: userDto.email });
      if (!user) {
        return 'no user found';
      }
      const doesMatch = compareSync(userDto.password, user.password);

      if (doesMatch) {
        console.log(user);

        const token = this.jwtService.sign({ user });
        return token;
      } else {
        return 'password do not match';
      }
    } catch (err) {
      return err;
    }
  }
}
