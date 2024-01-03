import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import LoginValidator from 'start/validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

interface Credentials {
  email: string
  username: string
  password: string
}
export default class AuthController {
  public async registerShow({ request, response, auth }: HttpContextContract) {
    const { username, password, type } = request.only(['username', 'password', 'type'])
    //const user = await Admin.findBy('username', username)
    let user
    if (type === 'user') {
      user = await User.query().where('email', username).firstOrFail()
    } else if (type === 'admin') {
      user = await Admin.query().where('email', username).firstOrFail()
    } else {
      return 'Invalid type'
    }

    await request.validate({
      //@ts-ignore
      schema: LoginValidator,
      data: { username, password },
    })

    await auth.login(user)
    //const token = await auth.generate(user)
    // Verify the password
    const passwordMatch = await Hash.verify(password, user.password)

    if (!passwordMatch) {
      return response.status(401).send('Invalid credentials')
    }

    const token = await auth.attempt(username, password)

    return token
  }
  public async userlogin({ request, response, auth }: HttpContextContract) {
    //const { username, password, type } = request.only(['username', 'password', 'type'])
    const email = request.input('email')
    const username = request.input('username')
    const password = request.input('password')
    console.log(username, password, email)
    var credentials: Credentials = { password: password, email: '', username: '' }
    if (email) {
      credentials['email'] = email
      const user = await User.query().where('email', email).first()

      if (!user) return response.unauthorized('User does not exist!')
      if (!user?.verified) return response.unauthorized('User does not exist!')

      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }

      const token = await auth.attempt(credentials?.email, credentials?.password)
      return token
    } else {
      credentials['username'] = username
      const user = await User.query().where('username', username).first()

      if (!user) return response.unauthorized('User does not exist!')
      if (!user?.verified)
        return response.unauthorized({
          success: false,
          message: 'You are not verified',
          data: {
            action: 'verification',
          },
        })

      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }

      const token = await auth.attempt(credentials?.username, credentials?.password)

      return token
    }
  }
}
