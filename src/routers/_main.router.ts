import * as cors from 'cors';
import { Router } from 'express';
import { corsOptions } from '../chamber';
import { UserRouter } from './users.router';

export const MainRouter: Router = Router();



/** Mount Routers */

MainRouter.options(`*`, cors(corsOptions));
MainRouter.use('/users', cors(corsOptions), UserRouter);
