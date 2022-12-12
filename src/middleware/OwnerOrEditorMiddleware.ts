import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { CallbackError, Model } from 'mongoose';
import { ResponseService } from '../shoppinglist/response.service';
import {
  ShoppingList,
  ShoppingListDocument,
} from '../shoppinglist/schemas/shoppingList';

@Injectable()
export class OwnerOrEditorMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
    private responseService: ResponseService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.user._id;
    this.shoppingListModel.findOne(
      { _id: req.params.listId },
      (err: CallbackError | undefined, list: any) => {
        if (err) {
          return res.status(403).json(this.responseService.errorResponse(err));
        }
        if (!list) {
          return res
            .status(404)
            .json(this.responseService.errorResponse('no list found'));
        }
        if (
          list.owner.toString() === userId ||
          list.editors.includes(new mongoose.Types.ObjectId(userId))
        ) {
          next();
        } else {
          return res
            .status(403)
            .json(this.responseService.errorResponse('unauthorized'));
        }
      },
    );
  }
}
