import mongoose, { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingList, ShoppingListDocument } from './schemas/shoppingList';
import IShoppingList from './interfaces/shopping-list';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async create(shoppingListDto: IShoppingList): Promise<ShoppingList> {
    const createdList = new this.shoppingListModel({
      name: shoppingListDto.name,
      editors: shoppingListDto.editors,
      owner: new mongoose.Types.ObjectId(this.request.user?._id),
      items: shoppingListDto.items,
    });

    return createdList.save();
  }
  async getListByOwnerId() {
    return this.shoppingListModel.find({ owner: this.request.user?.user._id });
  }
}
