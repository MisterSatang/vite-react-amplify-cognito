import { Router } from 'express';
import { resgister } from '../controller/auth.controller'
import { validateRegister } from '../middleware/validation/validation'

const routes = Router();

routes.post('/register', validateRegister, resgister);

export default routes;