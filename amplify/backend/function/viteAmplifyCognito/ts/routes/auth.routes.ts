import { Router } from 'express';
import { resgister, login, confirmRegister, forgotPassword, confirmNewPassword } from '../controller/auth.controller'
import { validateRegister, validateLogin, validateConfirmRegister, validateForgotPassword, validateConfirmNewPassword } from '../middleware/validation/validation.middleware'
import AuthMiddleware from '../middleware/auth/auth.middleware';
import type { UserCognitoJwtPayload, IGetUserCognitoAuthInfoRequest } from '../types/jwt'

const routes = Router();
const auth = new AuthMiddleware();

routes.post('/register', validateRegister, resgister);
routes.post('/confirmRegister', validateConfirmRegister, confirmRegister);

routes.post('/login', validateLogin, login);

routes.post('/forgotPassword', validateForgotPassword, forgotPassword)
routes.post('/confirmNewPassword', validateConfirmNewPassword, confirmNewPassword)

routes.get('/token', auth.verifyToken, async (req: IGetUserCognitoAuthInfoRequest, res) => {
    const user = req.jwtObject as UserCognitoJwtPayload
    // console.log(user);
    res.json({ user });
})

export default routes;