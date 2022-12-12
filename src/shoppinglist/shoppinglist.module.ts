import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingList, shoppingListSchema } from './schemas/shoppingList';
import { ShoppingListController } from './shoppingList.controller';
import { ShoppingListService } from './shoppingList.service';
import { ResponseService } from './response.service';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { OwnerMiddleware } from '../middleware/OwnerMiddleware';
import { OwnerOrEditorMiddleware } from '../middleware/OwnerOrEditorMiddleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingList.name, schema: shoppingListSchema },
    ]),
    JwtModule.register({ secret: 'sdcvdfvfd' }),
  ],
  providers: [ShoppingListService, ResponseService],
  controllers: [ShoppingListController],
})
export class ShoppinglistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/shoppinglist', method: RequestMethod.POST },
        { path: '/shoppinglist', method: RequestMethod.GET },
      );
    consumer.apply(AuthMiddleware, OwnerMiddleware).forRoutes(
      { path: '/shoppinglist/:listId', method: RequestMethod.PUT },
      { path: '/shoppinglist/:listId', method: RequestMethod.DELETE },
      { path: '/shoppinglist/:listId/editor', method: RequestMethod.POST },
      {
        path: '/shoppinglist/:id/editor/:editorId',
        method: RequestMethod.DELETE,
      },
    );
    consumer.apply(AuthMiddleware, OwnerOrEditorMiddleware).forRoutes(
      { path: '/shoppinglist/:listId', method: RequestMethod.GET },
      { path: '/shoppinglist/:listId/item', method: RequestMethod.POST },
      { path: '/shoppinglist/:listId/item/itemid', method: RequestMethod.PUT },
      {
        path: '/shoppinglist/:ListId/item/:itemid',
        method: RequestMethod.DELETE,
      },
      {
        path: '/shoppinglist/:id/item/:itemid/check',
        method: RequestMethod.GET,
      },
      {
        path: '/shoppinglist/:id/item/:itemid/uncheck',
        method: RequestMethod.GET,
      },
    );
  }
}
