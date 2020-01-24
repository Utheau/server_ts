import { MetadataKeys } from './MetadataKeys';
import { Methods } from './Methods';
import { AppRouter } from './../../AppRouter';
import 'reflect-metadata';
import { RequestHandler, NextFunction } from 'express';


// function bodyValidators(keys: string): RequestHandler {
//   return function (req: Request, res: Response, next: NextFunction) {
//     if (!req.body) {
//       res.status(422).send('invalid request');
//       return;
//     }

//     for (let key of keys) {
//       if 
//     }

//   }
// }

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();

    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype[key]);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);

      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];

      if (path) {
        router[method](`${routePrefix}${path}`, ...middlewares, routeHandler);
      }
    }
  };
}