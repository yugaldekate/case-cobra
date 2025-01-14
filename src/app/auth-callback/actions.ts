'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getAuthStatus = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user.email) {
        throw new Error('Invalid user data');
    }

    let existingUser = await db.user.findFirst({
        where: { 
            id: user.id,
        },
    });

    if (!existingUser) {
        existingUser = await db.user.create({
            data: {
                id: user.id,
                email: user.email,
            },
        });
    }

    console.log("getAuthStatus : ", existingUser);
    
    return { success: true, user: existingUser }
}
