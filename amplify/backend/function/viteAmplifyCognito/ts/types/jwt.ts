import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken'

export interface UserCognitoJwtPayload extends JwtPayload {
    sub: string,
    iss: string,
    client_id: string,
    origin_jti: string,
    event_id: string,
    token_use: string,
    scope: string,
    auth_time: number,
    exp: number,
    iat: number,
    jti: string,
    username: string
}

export interface IGetUserCognitoAuthInfoRequest extends Request {
    jwtObject?: string | JwtPayload;
}
