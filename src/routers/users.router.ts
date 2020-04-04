import { Router } from 'express';
import { UserService } from '../services/user.service';

export const UserRouter: Router = Router();



// GET Routes

UserRouter.get('', UserService.main);
UserRouter.get('/check-session', UserService.check_session);


// POST Routes



// PUT Routes



// DELETE Routes