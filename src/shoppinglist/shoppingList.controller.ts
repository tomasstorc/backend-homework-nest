import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';

import { AddEditorDto, ItemDto, ShoppingListDTo } from './dto/shoppingList';
import { ResponseService } from './response.service';

import { ShoppingListService } from './shoppingList.service';

@Controller('shoppinglist')
export class ShoppingListController {
  constructor(
    private shoppingListService: ShoppingListService,
    private responseService: ResponseService,
  ) {}

  @Post()
  async create(@Body() createListDto: ShoppingListDTo) {
    const createdList = await this.shoppingListService.create(createListDto);
    return this.responseService.successResponse('created', createdList);
  }
  @Get()
  async getAllById() {
    const lists = await this.shoppingListService.getListByOwnerId();
    return this.responseService.successResponse('success', lists);
  }
  @Get(':id')
  async getListById(@Param() params) {
    const list: any = await this.shoppingListService.getListById(params.id);
    if (list.status === 'error') {
      return this.responseService.errorResponse(list.err);
    } else {
      return null;
    }
    return this.responseService.successResponse('success', list);
  }

  @HttpCode(204)
  @Delete(':listId')
  async deleteList(@Param() params) {
    const deletedList: any = await this.shoppingListService.deleteListById(
      params.listId,
    );
    if (deletedList.status === 'error') {
      return this.responseService.errorResponse(deletedList.err);
    } else {
      return null;
    }
  }
  @Put(':listId')
  async updateList(@Param() params, @Body() updateListDto: ShoppingListDTo) {
    const updatedList: any = await this.shoppingListService.updateListById(
      params.id,
      updateListDto,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList.err);
    } else {
      return this.responseService.successResponse('list updated', updatedList);
    }
  }
  @Post(':listId/item')
  async addItemToList(@Param() params, @Body() itemDto: ItemDto) {
    const updatedList: any = await this.shoppingListService.addItemToList(
      params.listId,
      itemDto,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList.err);
    } else {
      return this.responseService.successResponse('item added', updatedList);
    }
  }

  @Put(':listId/item/:itemid')
  async updatemItemInList(@Param() params, @Body() itemDto: ItemDto) {
    const updatedList: any = await this.shoppingListService.updateItemInList(
      params.listId,
      params.itemid,
      itemDto,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList.err);
    } else {
      return this.responseService.successResponse('item updated', updatedList);
    }
  }

  @Delete(':listId/item/:itemid')
  async deleteItemFromList(@Param() params) {
    const updatedList: any = await this.shoppingListService.deleteItemFromList(
      params.listId,
      params.itemId,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList.err);
    } else {
      return this.responseService.successResponse('item deleted', updatedList);
    }
  }
  @Get(':listId/item/:itemid/check')
  async markItemAsChecked(@Param() params) {
    const updatedList: any = await this.shoppingListService.markItemAschecked(
      params.listId,
      params.itemId,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList?.err);
    } else {
      return this.responseService.successResponse('item checked', updatedList);
    }
  }
  @Get(':listId/item/:itemid/uncheck')
  async markItemAsUnchecked(@Param() params) {
    const updatedList: any = await this.shoppingListService.markItemAsUnchecked(
      params.listId,
      params.itemId,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList?.err);
    } else {
      return this.responseService.successResponse(
        'item unchecked',
        updatedList,
      );
    }
  }
  @Post(':listId/editor')
  async addEditorToList(@Param() params, @Body() editorId: AddEditorDto) {
    const updatedList: any = await this.shoppingListService.addEditorToList(
      params.listId,
      editorId,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList?.err);
    } else {
      return this.responseService.successResponse('editor added', updatedList);
    }
  }
  @Delete(':listId/editor/:editorId')
  deleteEditorFromList(@Param() params) {
    const updatedList: any = this.shoppingListService.removeEditorFromList(
      params.listId,
      params.editorId,
    );
    if (updatedList.status === 'error') {
      return this.responseService.errorResponse(updatedList?.err);
    } else {
      return this.responseService.successResponse(
        'editor removed',
        updatedList,
      );
    }
  }
}
