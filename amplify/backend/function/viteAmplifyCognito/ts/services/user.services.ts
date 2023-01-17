import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const _addUser = async (userId: string, citizenId: string, personId?: string) => {
    try {
        await prisma.users.create({
            data: {
                userId,
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


