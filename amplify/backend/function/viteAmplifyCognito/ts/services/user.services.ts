import { PrismaClient } from '@prisma/client';
import z from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
    email: z.string({
        required_error: "Email is required",
    }).email("Not a valid email"),
    password: z.string().min(8),
    uuid: z.string().uuid()
});

export const _addUser = async (userId: string, citizenId: string) => {
    try {
        await prisma.users.create({
            data: {
                userId,
                citizenId,
            }
        })
        return {
            status: 'created'
        }
    } catch (error) {
        return {
            status: 'failed'
        }
    }
}


