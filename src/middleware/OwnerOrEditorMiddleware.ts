import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';

import { CallbackError, Model } from 'mongoose';
import {
  ShoppingList,
  ShoppingListDocument,
} from 'src/shoppinglist/schemas/shoppingList';

@Injectable()
export class OwnerOrEditorMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.user._id;
    this.shoppingListModel.findOne(
      { _id: req.params.id },
      (err: CallbackError | undefined, list: ShoppingListDocument) => {
        if (err) {
          return res.status(403).json({ status: 'error', error: err });
        }
        if (!list) {
          return res
            .status(404)
            .json({ status: 'error', error: 'no list found' });
        }
        if (list.owner === userId || list.editors.includes(userId)) {
          next();
        } else {
          return res.status(403).json({
            status: 'error',
            error: 'you are not allowed for requested operation',
          });
        }
      },
    );
  }
}
