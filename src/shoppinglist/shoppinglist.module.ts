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
import { AuthMiddleware } from 'src/middleware/authMiddleware';
import { OwnerMiddleware } from 'src/middleware/ownerMiddleware';
import { OwnerOrEditorMiddleware } from 'src/middleware/OwnerOrEditorMiddleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShoppingList.name, schema: shoppingListSchema },
    ]),
    JwtModule.register({ secret: 'sdcvdfvfd' }),
  ],
  providers: [ShoppingListService],
  controllers: [ShoppingListController],
})
export class ShoppinglistModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/shoppinglist', method: RequestMethod.POST },
        { path: '/shoppinglist/', method: RequestMethod.GET },
      );
    consumer.apply(AuthMiddleware, OwnerMiddleware).forRoutes(
      { path: '/shoppinglist/:id', method: RequestMethod.PUT },
      { path: '/shoppinglist/:id', method: RequestMethod.DELETE },
      { path: '/shoppinglist/:id/editor', method: RequestMethod.POST },
      {
        path: '/shoppinglist/:id/editor/:editorid',
        method: RequestMethod.DELETE,
      },
    );
    consumer.apply(AuthMiddleware, OwnerOrEditorMiddleware).forRoutes(
      { path: '/shoppinglist/:id', method: RequestMethod.GET },
      { path: '/shoppinglist/:id/item', method: RequestMethod.POST },
      { path: '/shoppinglist/:id/item', method: RequestMethod.PUT },
      {
        path: '/shoppinglist/:id/item/:itemid',
        method: RequestMethod.DELETE,
      },
      {
        path: '/shoppinglist/:id/item/:itemid/check',
        method: RequestMethod.GET,
      },
    );
  }
}
