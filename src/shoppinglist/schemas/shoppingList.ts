import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Item, itemSchema } from './item';
import { User } from 'src/users/schemas/User';

export type ShoppingListDocument = HydratedDocument<ShoppingList>;

@Schema()
export class ShoppingList {
  @Prop()
  name: string;
  @Prop({
    type: [itemSchema],
  })
  items: Array<Item>;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  editors: Array<User>;
}

export const shoppingListSchema = SchemaFactory.createForClass(ShoppingList);
