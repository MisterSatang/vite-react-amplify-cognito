import { httpStatusType } from './http'
import { Request, Response } from 'express'

interface ReturnResponseInterface {
    "success": boolean,
    "message": string,
    "error_code": number,
    "data": {}
}

type Send<T = Response> = (body?: ReturnResponseInterface) => T;

export default interface ReturnResponse extends Response {
    json: Send<this>;
}