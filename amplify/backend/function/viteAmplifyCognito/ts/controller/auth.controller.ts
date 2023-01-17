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
                    result.UserSub ? _addUser(result.UserSub, username, getPersonId).then(result2 => { result2 ? res.status(200).json({ message: 'create sucesss' }) : res.status(400) }) : res.status(400).json({ message: 'fail to create user', result })
                })
        } else {
            res.status(400).json({ message: 'dont have citizenId in databases' })
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
        cognitoService.login(username, password)
            .then(result => {
                result.AuthenticationResult ? res.status(200).json({ message: 'Login sucesss', result }) : res.status(400).json({ message: 'failed to login', result });
            })
    } catch (error) {
        res.json(error);
    }
}