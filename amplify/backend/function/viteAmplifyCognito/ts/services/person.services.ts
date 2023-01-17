import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findByCitizenId = async (citizenId: string) => {
    const result = await prisma.person.findUnique({
        where: {
            citizenId
        }
    })
    return result?.perosnId;
}
