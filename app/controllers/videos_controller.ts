import type { HttpContext } from '@adonisjs/core/http'
import { createVideoValidator } from '#validators/video'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import Video from '#models/video'


export default class VideosController {

    async create({ view }: HttpContext) {
        return view.render('pages/videos/create')
    }

    async store({ request, response, auth, session }: HttpContext) {
        const { title, description, video, thumbnail, duration } = await request.validateUsing(createVideoValidator)
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
            duration,
            videoPath: `/uploads/videos/${videoFileName}`,
            thumbnailPath: thumbnailFileName ? `/uploads/thumbnails/${thumbnailFileName}` : null,
        })

        session.flash('success', 'Vídeo publicado com sucesso!')

        return response.redirect().toRoute('dashboard')
    }

    async show({ params, view }: HttpContext) {
        const video = await Video.findOrFail(params.id)
        await video.load('author')

        video.viewsCount = (video.viewsCount ?? 0) + 1
        await video.save()

        return view.render('pages/videos/show', { video })
    }

    async search({ request, view }: HttpContext) {
        const query = request.input('q', '').trim().replace(/^@/, '')
        const sort = request.input('sort') === 'views' ? 'views' : 'recent'
        const videosQuery = Video.query()
          .preload('author')
          .orderBy(sort === 'views' ? 'views_count' : 'created_at', 'desc')

        if (query) {
          videosQuery.where((builder) => {
            builder
              .whereILike('title', `%${query}%`)
              .orWhereHas('author', (authorQuery) => {
                authorQuery.whereILike('username', `%${query}%`)
              })
          })
        }

        const videos = await videosQuery

        return view.render('pages/search', { videos, query, sort })
    }

    async index({ request, view }: HttpContext) {
        const query = request.input('q', '').trim().replace(/^@/, '')

        const videosQuery = Video.query()
          .preload('author')
          .orderBy('created_at', 'desc')

        if(query) {
            videosQuery.where((builder) => {
              builder
                .whereILike('title', `%${query}%`)
                .orWhereHas('author', (authorQuery) => {
                  authorQuery.whereILike('username', `%${query}%`)
                })
            })
        }

        const videos = await videosQuery

        return view.render('pages/admin/videos', { videos, query })
    }
}
