import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request, view }: HttpContext) {
    const query = request.input('q', '').trim().replace(/^@/, '')
    const role = request.input('role', 'all')
    const usersQuery =  User.query().orderBy('created_at', 'desc')

    if(query) {
      usersQuery.where((builder) => {
        builder
          .whereILike('full_name',`%${query}%`)
          .orWhereILike('username', `%${query}%`)
          .orWhereILike('email', `%${query}%`)
      })
    }

    if(role === 'admin') {
      usersQuery.where('is_admin', true)
    } else if(role === 'user') {
      usersQuery.where('is_admin', false)
    }

    const users = await usersQuery
    const adminCount = users.filter((user) => user.isAdmin).length
  
    return view.render('pages/admin/users', { users, adminCount, query, role })
  }
}