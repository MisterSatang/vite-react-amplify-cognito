import * as express from 'express'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import Cognito from '../services/cognito.services';
import { _addUser } from '../services/user.services';
import ReturnResponse from '../types/return.Response'
import { httpStatus } from '../types/http'

export const resgister = async (req: Request, res: ReturnResponse) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, message: "result is empty", error_code: httpStatus.badRequest, data: {} });
        }

        const { username, password, email } = req.body;

        let userAttr = [];
        userAttr.push({ Name: 'email', Value: email });

        const cognitoService = new Cognito();
        cognitoService.resgister(username, password, userAttr)
            .then(result => {
                result.UserSub ?
                    _addUser(result.UserSub, username, email).then(result2 => {
                        result2 ? res.status(201).json({ success: true, message: "Create user success", error_code: httpStatus.created, data: { result } })
                            : res.status(422).json({ success: false, message: 'fail to create user', error_code: httpStatus.unprocessableEntity, data: { result } })
                    }) : res.status(422).json({ success: false, message: 'fail to create user', error_code: httpStatus.unprocessableEntity, data: { result } })
            })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'bad request', error_code: httpStatus.badRequest, data: { error } })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username, password } = req.body;
        let cognitoService = new Cognito();

        const loginResult = await cognitoService.login(username, password)
        if (loginResult.AuthenticationResult) {
            res.cookie('AccessToken', loginResult.AuthenticationResult.AccessToken, {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.status(200).json({ message: 'Login sucesss', result: loginResult })
        } else {
            res.status(400).json({ message: 'failed to login', result: loginResult });
        }
    } catch (error) {
        res.json(error);
    }
}

export const confirmRegister = async (req: Request, res: ReturnResponse) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, message: "result is empty", error_code: httpStatus.badRequest, data: {} });
        }
        // console.log(req.body)
        const { username, code } = req.body;

        let cognitoService = new Cognito();
        cognitoService.confirmRegister(username, code)
            .then(result => {
                result.status ? res.status(200).json({ success: true, error_code: httpStatus.ok, message: 'verify email success', data: { result } }) : res.status(401).json({ success: false, message: 'verify fail', error_code: httpStatus.unauthorized, data: { result } })
            })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'bad request', error_code: httpStatus.badRequest, data: { error } })
    }

}

export const forgotPassword = async (req: Request, res: ReturnResponse) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, message: "result is empty", error_code: httpStatus.badRequest, data: {} });
        }
        const { username } = req.body;

        let cognitoService = new Cognito();
        cognitoService.forgotPassword(username)
            .then(result => {
                result.status ? res.status(200).json({ success: true, error_code: httpStatus.ok, message: 'send code to email success', data: { result } }) : res.status(400).json({ success: false, error_code: httpStatus.badRequest, message: 'fail to send code to email', data: { result } })
            });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'bad request', error_code: httpStatus.badRequest, data: { error } })
    }
}

export const confirmNewPassword = async (req: Request, res: ReturnResponse) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, message: "result is empty", error_code: httpStatus.badRequest, data: {} });
        }

        const { username, password, code } = req.body;

        let cognitoService = new Cognito();
        cognitoService.confirmNewPassword(username, password, code)
            .then(result => {
                result.status ? res.status(201).json({ success: true, error_code: httpStatus.created, message: 'confirm new password success', data: { result } }) : res.status(400).json({ success: false, error_code: httpStatus.badRequest, message: 'fail to confirm new password', data: { result } })
            })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'bad request', error_code: httpStatus.badRequest, data: { error } })
    }
}