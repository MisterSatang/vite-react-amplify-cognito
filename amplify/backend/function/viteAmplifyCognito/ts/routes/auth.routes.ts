import { Router } from 'express';
import { resgister, login } from '../controller/auth.controller'
import { validateRegister, validateLogin } from '../middleware/validation/validation.middleware'
import AuthMiddleware from '../middleware/auth/auth.middleware';
import type { UserCognitoJwtPayload, IGetUserCognitoAuthInfoRequest } from '../types/jwt'

const routes = Router();
const auth = new AuthMiddleware();

routes.post('/register', validateRegister, resgister);
routes.post('/login', validateLogin, login);
routes.get('/token', auth.verifyToken, async (req: IGetUserCognitoAuthInfoRequest, res) => {
    const user = req.jwtObject as UserCognitoJwtPayload
    // console.log(user);
    res.json({ user });
})

export default routes;