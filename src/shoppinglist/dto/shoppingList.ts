import {
  MinLength,
  MaxLength,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsObjectId } from 'class-validator-mongo-object-id';
import mongoose from 'mongoose';

import IItem from '../interfaces/item';

export class AddEditorDto {
  @IsObjectId()
  editorId: mongoose.Types.ObjectId;
}

export class ItemDto {
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  name: string;
  @IsBoolean()
  @IsOptional()
  done: boolean;

  @IsNumber()
  @IsOptional()
  quantity: number;
}

export class ShoppingListDTo {
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ItemDto)
  items: Array<IItem>;

  @IsOptional()
  owner: mongoose.Types.ObjectId;
  @IsOptional()
  editors?: Array<mongoose.Types.ObjectId>;
}
