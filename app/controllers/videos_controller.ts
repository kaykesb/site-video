import type { HttpContext } from '@adonisjs/core/http'
import { createVideoValidator } from '#validators/video'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import Video from '#models/video'


export default class VideosController {

    async create({ view }: HttpContext) {
        return view.render('pages/videos/create')
    }

    async store({ request, response, auth }: HttpContext) {
        const { title, description, video, thumbnail } = await request.validateUsing(createVideoValidator)
        const videoFileName = `${randomUUID()}.${video.extname}`
        await video.move(app.makePath('public/uploads/videos'), { name: videoFileName })

        let thumbnailFileName: string | null = null
        if (thumbnail) {
            thumbnailFileName = `${randomUUID()}.${thumbnail.extname}`
            await thumbnail.move(app.makePath('public/uploads/thumbnails'), { name: thumbnailFileName })
        }

        const user = auth.user!
        await user.related('videos').create({
            title,
            description,
            videoPath: `/uploads/videos/${videoFileName}`,
            thumbnailPath: thumbnailFileName ? `/uploads/thumbnails/${thumbnailFileName}` : null,
        })

        return response.redirect().toRoute('dashboard')
    }

    async show({ params, view }: HttpContext) {
        const video = await Video.findOrFail(params.id)
        await video.load('author')

        video.viewsCount = (video.viewsCount ?? 0) + 1
        await video.save()

        return view.render('pages/videos/show', { video })
    }
}