import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('cadastro', [controllers.NewAccount, 'create'])
    router.post('cadastro', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.get('/buscar', [controllers.Videos, 'search']).as('search')
    router.on('/perfil').render('pages/profile').as('profile')
    router.on('/perfil/editar').render('pages/profile_edit').as('profile.edit')
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('/videos/enviar', [controllers.Videos, 'create'])
    router.post('/videos', [controllers.Videos, 'store'])

    router.get('/videos/:id', [controllers.Videos, 'show'])

    router.get('admin/videos', [controllers.Videos, 'index']).use(middleware.admin()).as('admin.videos.index')
    router.get('admin/usuarios', [controllers.Users, 'index']).use(middleware.admin()).as('admin.users.index')
    router.on('admin/usuarios/:id').render('pages/admin/user_show').use(middleware.admin()).as('admin.users.show')
  })
  .use(middleware.auth())

