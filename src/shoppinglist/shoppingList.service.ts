import mongoose, { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingList, ShoppingListDocument } from './schemas/shoppingList';
import IShoppingList from './interfaces/shopping-list';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import IItem from './interfaces/item';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  async create(shoppingListDto: IShoppingList) {
    try {
      const createdList = new this.shoppingListModel({
        name: shoppingListDto.name,
        editors: shoppingListDto.editors,
        owner: new mongoose.Types.ObjectId(this.request.user?.user._id),
        items: shoppingListDto.items,
      });

      return createdList.save();
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async getListByOwnerId() {
    return this.shoppingListModel.find({ owner: this.request.user?.user._id });
  }
  async getListById(listId: mongoose.Types.ObjectId) {
    try {
      return this.shoppingListModel.findOne({ _id: listId });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async deleteListById(listid: mongoose.Types.ObjectId) {
    try {
      return this.shoppingListModel.findByIdAndDelete(listid);
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async updateListById(
    listId: mongoose.Types.ObjectId,
    shoppingListDto: IShoppingList,
  ) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, shoppingListDto);
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async addItemToList(listId: mongoose.Types.ObjectId, itemDto: IItem) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $push: { items: itemDto },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async updateItemInList(
    listId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
    itemDto: IItem,
  ) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $set: { items: { _id: itemId, itemDto } },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async deleteItemFromList(
    listId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
  ) {
    try {
      this.shoppingListModel.findByIdAndUpdate(listId, {
        $pull: { items: { _id: itemId } },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async markItemAschecked(
    listId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
  ) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $set: { items: { _id: itemId, checked: true } },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async markItemAsUnchecked(
    listId: mongoose.Types.ObjectId,
    itemId: mongoose.Types.ObjectId,
  ) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $set: { items: { _id: itemId, checked: false } },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }

  async addEditorToList(listId: mongoose.Types.ObjectId, editorId: any) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $push: { editors: editorId },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
  async removeEditorFromList(
    listId: mongoose.Types.ObjectId,
    editorId: mongoose.Types.ObjectId,
  ) {
    try {
      return this.shoppingListModel.findByIdAndUpdate(listId, {
        $pull: { editors: editorId },
      });
    } catch (err) {
      return { status: 'error', err };
    }
  }
}
