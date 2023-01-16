import { Request, Response, NextFunction } from 'express'
import z from 'zod';

export const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
        email: z.string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: z.string().min(8),
    });
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