import * as express from 'express';
import { ExampleController } from './example/example.controller';
import { ItemShopController } from './item-shop/item-shop.controller';
import { FirstController } from './first/first.controller';
import { IpiresiesController } from './ipiresies/ipiresies.controller';
import { TodayController } from './today/today.controller';
const apiV1Router = express.Router();


apiV1Router
  // Example routes
  .use(
    '/example',
    new ExampleController().applyRoutes()
  )
  .use(
    '/item-shop',
    new ItemShopController().applyRoutes()
  )
  .use(
    '/first',
    new FirstController().applyRoutes()
  )
  .use(
    '/services',
    new IpiresiesController().applyRoutes()
  )
  .use(
    '/today',
    new TodayController().applyRoutes()
  )
  /*Mine v1's*/


export { apiV1Router };

