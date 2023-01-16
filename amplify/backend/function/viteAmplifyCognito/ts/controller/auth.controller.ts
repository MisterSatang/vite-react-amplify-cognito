import * as express from 'express'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import Cognito from '../services/cognito.services';
import { _addUser } from '../services/user.services';

export const resgister = async (req: Request, res: Response) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username, password, email } = req.body;
        let userAttr = [];
        userAttr.push({ Name: 'email', Value: email });
        let cognitoService = new Cognito();
        cognitoService.resgister(username, password, userAttr)
            .then(result => {
                result.UserSub ? _addUser(result.UserSub, username).then(result2 => { result2 ? res.status(200).json({ status: 'create sucesss' }) : res.status(400) }) : res.status(400).json({ status: 'fail to create user', result })
            })
    } catch (error) {
        res.json(error);
    }
}