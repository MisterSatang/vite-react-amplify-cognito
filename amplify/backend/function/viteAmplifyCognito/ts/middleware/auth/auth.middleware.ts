import { Request, Response, NextFunction } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import type { UserCognitoJwtPayload, IGetUserCognitoAuthInfoRequest } from '../../types/jwt'
import dotenv from 'dotenv';
import ReturnResponse from '../../types/return.Response'
import { httpStatus } from '../../types/http'
dotenv.config()

const pems: { [key: string]: any } = {}

class AuthMiddleware {
    private poolRegion: string | any;
    private userPoolId: string | any;

    constructor() {
        this.poolRegion = process.env.POOLREGION
        this.userPoolId = process.env.USERPOOLID
        this.setUp()
    }

    verifyToken(req: IGetUserCognitoAuthInfoRequest, res: ReturnResponse, next: NextFunction) {
        try {
            const token = req.header('Auth');
            // console.log(token)
            if (!token) return res.status(401).json({ success: false, message: "Token not found", error_code: httpStatus.unauthorized, data: {} });

            const decodedJwt = jwt.decode(token, { complete: true });
            if (decodedJwt === null) {
                return res.status(401).json({ success: false, message: "Token not found", error_code: httpStatus.unauthorized, data: {} });
            }
            // console.log(decodedJwt)
            const kid: any = decodedJwt.header.kid;
            const pem = pems[kid];
            // console.log(pem)
            if (!pem) {
                return res.status(401).json({ success: false, message: "Token not found", error_code: httpStatus.unauthorized, data: {} });
            }
            const decode = jwt.verify(token, pem);
            req.jwtObject = decode;
            // console.log(decode);
            next();

        } catch (error) {
            return res.status(400).json({ success: false, message: 'bad request', error_code: httpStatus.badRequest, data: { error } })
        }
    }

    private async setUp() {
        const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;

        try {
            const response = await fetch(URL);
            if (response.status !== 200) {
                throw 'request not successful'
            }
            const data = await response.json();
            const { keys }: any = data;
            for (let i = 0; i < keys.length; i++) {
                const key_id = keys[i].kid;
                const modulus = keys[i].n;
                const exponent = keys[i].e;
                const key_type = keys[i].kty;
                const jwk = { kty: key_type, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
        } catch (error) {
            console.log(error)
            console.log('Error! Unable to download JWKs');
        }
    }
}

export default AuthMiddleware