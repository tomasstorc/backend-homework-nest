import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Item {
  @Prop({
    type: String,
    min: [3, 'name must be atleast 3 characters long'],
    max: [20, 'name must have maximum 20 characters'],
    required: [true, 'name is required'],
  })
  name: string;
  @Prop({
    default: false,
    type: Boolean,
  })
  done: false;
  @Prop({
    type: Number,
    min: [1, 'minimum quantity for item is 1'],
    default: 1,
  })
  quantity: number;
}

export const itemSchema = SchemaFactory.createForClass(Item);
