import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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

createVideoValidator.messagesProvider = new SimpleMessagesProvider({
  'video.required': 'Selecione um vídeo para enviar.',
  'video.file.extname': 'Envie um vídeo nos formatos MP4, WebM, MOV ou MKV.',
  'title.required': 'Informe o título do vídeo.',
  'title.minLength': 'O título deve ter pelo menos {{ min }} caracteres.',
  'title.maxLength': 'O título não pode ter mais de {{ max }} caracteres.',
  'description.maxLength': 'A descrição não pode ter mais de {{ max }} caracteres.',
  'thumbnail.file.extname': 'A imagem de capa deve estar no formato JPG, JPEG, PNG ou WebP.',
  'thumbnail.file.size': 'A imagem de capa não pode ultrapassar 5 MB.',
})