//const { schema, rules } = require('Validator')
import { schema, rules } from '@ioc:Adonis/Core/Validator'

const LoginValidator = {
  username: schema.string({}, [rules.required()]),
  password: schema.string({}, [rules.required()]),
}

export default LoginValidator
