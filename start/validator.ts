/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { VineDate, SimpleMessagesProvider } from '@vinejs/vine'


declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': ' {{ field }} é obrigatório',
    'string': ' {{ field }} deve ser um texto válido',
    'email': ' {{ field }} deve ser um e-mail válido',
    'minLength': ' {{ field }} deve ter pelo menos {{ min }} caracteres',
    'maxLength': ' {{ field }} deve ter no máximo {{ max }} caracteres',
    'database.unique': ' {{ field }} já está em uso',
    'sameAs': ' {{ field }} e {{ otherField }} devem ser iguais',
    'passwordConfirmation.sameAs': 'A confirmação de senha não confere com a senha',
  },
  {
    fullName: 'nome completo',
    email: 'e-mail',
    password: 'senha',
    passwordConfirmation: 'confirmação de senha',
    username: 'nome de usuário',
  }
)
