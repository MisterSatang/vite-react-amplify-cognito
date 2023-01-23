import { Request, Response, NextFunction } from 'express'
import z from 'zod';
import { _findEmailValidation } from '../../services/user.services';

export const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        email: z.string({
            required_error: "Email is required to register",
        }).email("Not a valid email"),
        password: z.string().min(8),
        username: z.string({
            required_error: "user name is required to register",
        })
    });

    const findEmail = await _findEmailValidation(req.body.email);

    if (!(verify(req.body.username))) {
        return res.status(400).json({ message: 'Citizen id is not true' });
    }

    // console.log(findEmail);

    if (findEmail) {
        return res.status(400).json({ message: 'Email is already exit', result: { message: 'Email is Already exists' } });
    }

    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        username: z.string({
            required_error: 'Username is required to login'
        }),
        password: z.string({
            required_error: 'password is required'
        }).min(8)
    })

    if (!(verify(req.body.username))) {
        return res.status(400).json({ message: 'Citizen id is not true' });
    }

    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }

}

export const validateConfirmRegister = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        username: z.string({
            required_error: 'Username is required to confirm registration'
        }),
        code: z.string({
            required_error: 'code is required to confirm registration'
        }).min(6).max(6)
    })

    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const validateForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        username: z.string({
            required_error: 'Username is required to forgot password'
        })
    })

    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const validateConfirmNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        username: z.string({
            required_error: 'Username is required to confirm registration'
        }),
        password: z.string({
            required_error: 'password is required'
        }).min(8),
        code: z.string({
            required_error: 'code is required to confirm registration'
        }).min(6).max(6)
    })

    try {
        await schema.parseAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

const verify = (id: string) => {
    if (id == null || id.length !== 13 || !/^[0-9]\d+$/.test(id)) {
        return false;
    }
    let i, sum = 0;
    for ((i = 0), (sum = 0); i < 12; i++) {
        sum += parseInt(id.charAt(i)) * (13 - i);
    }
    let check = (11 - sum % 11) % 10;
    if (check === parseInt(id.charAt(12))) {
        return true;
    }
    return false;
}