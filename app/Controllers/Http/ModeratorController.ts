import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Moderator from 'App/Models/Moderator'

interface Credentials {
  email: string
  username: string
  password: string
}

export default class UserController {
  public async index({ response, auth }: HttpContextContract) {
    const moderator = await auth.use('moderator').authenticate()
    const { username, firstname, lastname, photo, email } = moderator
    try {
      photo.url = await photo.getSignedUrl()
    } catch (error) {
      console.log(error)
    }
    return response.json({
      username,
      firstname,
      lastname,
      photo,
      email,
    })
  }

  public async signup({ request, response }: HttpContextContract) {
    const moderator = new Moderator()
    const { username, password, lastname, firstname, email } = request.only([
      'username',
      'password',
      'firstname',
      'lastname',
      'email',
    ])
    moderator.firstname = firstname
    moderator.lastname = lastname
    moderator.email = email
    moderator.username = username
    moderator.password = await Hash.make(password)
    var message: string = 'as moderator'
    const newModerator = await moderator.save()
    return response.json({
      message: `Account created as ${message}`,
      status: true,
      user: newModerator.toJSON(),
    })
  }

  public async signin({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const username = request.input('username')
    const password = request.input('password')
    console.log(username, password, email)
    var credentials: Credentials = { password: password, email: '', username: '' }
    if (email) {
      credentials['email'] = email
      const user = await Moderator.query().where('email', email).first()
      if (!user) return response.unauthorized('User does not exist!')
      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }
      const token = await auth.attempt(credentials?.email, credentials?.password)
      console.log(token)
      return token
    } else if (username) {
      credentials['username'] = username
      const user = await Moderator.query().where('username', username).first()
      console.log(user?.toJSON())
      if (!user) return response.unauthorized('User does not exist!')
      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }
      console.log(credentials)
      const token = await auth.use('api').attempt(credentials.username, credentials.password)
      console.log(token)
      return token
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const user = await auth.use('moderator').authenticate()
    const all = request.all()
    const file = request.file('filename')
    if (file?.fieldName === 'filename') {
      user.photo = Attachment.fromFile(file)
      const result = user.merge(all)
      if (result) {
        await user.save()
        const { username, firstname, lastname, photo, email } = result
        photo.url = await photo.getSignedUrl()
        return response.json({
          username,
          firstname,
          lastname,
          photo,
          email,
        })
      }
    } else {
      const result = user.merge(all)
      const { username, firstname, lastname, photo, email } = result
      photo.url = await photo.getSignedUrl()
      return response.json({
        username,
        firstname,
        lastname,
        photo,
        email,
      })
    }
  }
}
