'use server'

import { db } from '@/db'
import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from '@prisma/client'

export type SaveConfigArgs = {
    configId: string
    color: CaseColor
    finish: CaseFinish
    material: CaseMaterial
    model: PhoneModel
}

export async function saveConfig({ color, finish, material, model, configId }: SaveConfigArgs) {
    await db.configuration.update({
        where: { 
            id: configId 
        },
        data: { 
            color: color, 
            finish: finish, 
            material: material, 
            model: model,
        },
    });
}
