import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

// Validator para cadastro de novos usuários
export const signupValidator = vine.create({
  fullName: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  username: vine.string().minLength(3).maxLength(30).unique({ table: 'users', column: 'username' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
