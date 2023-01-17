import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const _addUser = async (userId: string, citizenId: string, personId: string, email: string) => {
    try {
        await prisma.users.create({
            data: {
                userId,
                email,
                citizenId,
                personId,
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

export const _findEmailValidation = async (email: string): Promise<boolean> => {
    try {
        const result = await prisma.users.findUnique({
            where: {
                email
            }
        })
        if (result) return true;
        return false;
    } catch (error) {
        return false;
    }
}


