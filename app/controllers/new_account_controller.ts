import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

// NewAccountController lida com o cadastro de novos usuários.

export default class NewAccountController {

  // método para exibir a página de cadastro
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  // método para criar uma nova conta e autenticar o usuário
  async store({ request, response, auth }: HttpContext) {
    const { fullName, email, username, password } = await request.validateUsing(signupValidator)
    const user = await User.create({ fullName, email, username, password })

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
