import vine from '@vinejs/vine'

export const createVideoValidator = vine.create({
    title: vine.string().minLength(3).maxLength(120),
    description: vine.string().maxLength(2000).optional(),
    video: vine.file({
        extnames: ['mp4', 'webm', 'mov', 'mkv'],
    }),
    thumbnail: vine.file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }).optional(),
    duration: vine.number().withoutDecimals().min(1),
})