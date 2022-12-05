import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';

import { CallbackError, Model } from 'mongoose';
import { ResponseService } from 'src/shoppinglist/response.service';
import {
  ShoppingList,
  ShoppingListDocument,
} from 'src/shoppinglist/schemas/shoppingList';

@Injectable()
export class OwnerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
    private responseService: ResponseService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.user._id;
    this.shoppingListModel.findOne(
      { _id: req.params.id },
      (err: CallbackError | undefined, list: ShoppingListDocument) => {
        if (err) {
          return res.status(400).json(this.responseService.errorResponse(err));
        }
        if (!list) {
          return res
            .status(404)
            .json(
              this.responseService.errorResponse('no list found by given id'),
            );
        }
        if (list.owner.toString() === userId) {
          next();
        } else {
          return res
            .status(403)
            .json(this.responseService.errorResponse('Unauthorized'));
        }
      },
    );
  }
}
