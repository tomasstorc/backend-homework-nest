import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';

import { AddEditorDto, ItemDto, ShoppingListDTo } from './dto/shoppingList';

import { ShoppingListService } from './shoppingList.service';

@Controller('shoppinglist')
export class ShoppingListController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Post()
  async create(@Body() createListDto: ShoppingListDTo) {
    return { body: createListDto };
  }
  @Get()
  async getById(@Request() req) {
    console.log(req.user);

    return {};
  }
  @Get(':id')
  async getListById(@Param() params) {
    return { params };
  }

  @Delete(':id')
  async deleteList(@Param() params) {
    return { params };
  }
  @Put(':id')
  async updateList(@Param() params, @Body() updateListDto: any) {
    return { params, body: updateListDto };
  }
  @Post(':id/item')
  async addItemToList(@Param() params, @Body() itemDto: ItemDto) {
    return { params, body: itemDto };
  }

  @Put(':id/item/:itemid')
  async updatemItemInList(@Param() params, @Body() itemDto: ItemDto) {
    return { params, body: itemDto };
  }

  @Delete(':id/item/:itemid')
  async deleteItemFromList(@Param() params) {
    return { params };
  }
  @Get(':id/item/:itemid/check')
  async markItemAsChecked(@Param() params) {
    return { params };
  }
  @Post(':id/editor')
  async addEditorToList(@Param() params, @Body() editorId: AddEditorDto) {
    return { params, body: editorId };
  }
  @Delete(':id/editor/:editorid')
  deleteEditorFromList(@Param() params) {
    return { params };
  }
}
