import * as express from 'express'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import Cognito from '../services/cognito.services';
import { _addUser } from '../services/user.services';
import { findByCitizenId } from '../services/person.services';

export const resgister = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username, password, email } = req.body;

        let userAttr = [];
        userAttr.push({ Name: 'email', Value: email });
        const getPersonId = await findByCitizenId(username);

        if (getPersonId) {
            const cognitoService = new Cognito();
            cognitoService.resgister(username, password, userAttr)
                .then(result => {
                    result.UserSub ? _addUser(result.UserSub, username, getPersonId, email).then(result2 => { result2 ? res.status(200).json({ message: 'create sucesss', result: result2 }) : res.status(400) }) : res.status(400).json({ message: 'fail to create user', result })
                })
        } else {
            res.status(400).json({ message: 'dont have citizenId in databases', result: { getPersonId } })
        }

    } catch (error) {
        res.json(error);
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

export const confirmRegister = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        // console.log(req.body)
        const { username, code } = req.body;

        let cognitoService = new Cognito();
        cognitoService.confirmRegister(username, code)
            .then(result => {
                result.status ? res.status(200).json({ message: 'verify email success', result }) : res.status(400).json({ message: 'verify fail', result })
            })
    } catch (error) {
        res.json(error);
    }

}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username } = req.body;

        let cognitoService = new Cognito();
        cognitoService.forgotPassword(username)
            .then(result => {
                result.status ? res.status(200).json({ message: 'send code to email success', result: result }) : res.status(400).json({ message: 'fail to send code to email', result })
            });
    } catch (error) {
        res.json(error);
    }
}

export const confirmNewPassword = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }

        const { username, password, code } = req.body;

        let cognitoService = new Cognito();
        cognitoService.confirmNewPassword(username, password, code)
            .then(result => {
                result.status ? res.status(200).json({ message: 'confirm new password success', result: result }) : res.status(400).json({ message: 'fail to confirm new password', result })
            })
    } catch (error) {
        res.json(error);
    }

}