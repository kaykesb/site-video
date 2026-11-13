import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    if(!app.inDev) {
      throw new Error('Esta seed só pode rodar em desenvolvimento')
    }

    const user = await User.findOrFail(1)
    user.username = 'teste'
    await user.save()
  }
}