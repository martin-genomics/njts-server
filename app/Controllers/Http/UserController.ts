import Application from '@ioc:Adonis/Core/Application'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import otpGenerator from 'otp-generator'
import Redis from '@ioc:Adonis/Addons/Redis'

//const process.env.CYCLIC_DB
interface Credentials {
  email: string
  username: string
  password: string
}

async function sendEmail(email) {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    })

    await Redis.set(`auth_${email}`, JSON.stringify({ email: email, otp: otp }))

    await Mail.use('smtp').send(
      (message) => {
        message.from('no-reply@njts.com')
        message.to(email)
        message.subject('NJTS: Account Verification')
        message.html(`
      ${otp}
    `)
      },
      {
        oTAGS: ['signup'],
      }
    )
  } catch (error) {
    console.log(error)
  }
}
export default class UserController {
  public async index({ response, auth }: HttpContextContract) {
    const user = await auth.use('user').authenticate()
    const { username, firstname, lastname, photo, email } = user
    try {
      photo.url = await photo.getSignedUrl()
      return response.json({
        username,
        firstname,
        lastname,
        photo,
        email,
      })
    } catch (error) {
      //
      return response.json({
        username,
        firstname,
        lastname,
        photo: null,
        email,
      })
    }
  }

  public async signup({ request, response }: HttpContextContract) {
    const user = new User()
    const { username, password, lastname, firstname, email } = request.only([
      'username',
      'password',
      'firstname',
      'lastname',
      'email',
    ])
    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    //user.photo = Attachment.fromFile()
    user.username = username
    /**
    user.related('purchaseHistory').create({
      product_id: 1,
    })
    **/
    //customer.purchaseHistory =
    user.password = await Hash.make(password)
    const neWcustomer = await user.save()
    /***
     * How to insert a product
     */
    neWcustomer.related('purchaseHistory').create({
      product_id: 2,
    })

    await sendEmail(email)
    return response.json({
      success: true,
      message:
        'Account created. The verification code has been sent to your email address and it will expire in 60s',
      data: {
        action: 'verification',
      },
    })
  }

  public async signin({ request, response, auth }: HttpContextContract) {
    var email = request.input('email')
    var username = request.input('username')
    var password = request.input('password')

    //@ts-ignore
    const payload = JSON.parse(request.raw())
    if (payload) {
      for (let key in payload) {
        if (key === 'email') {
          email = payload[key]
        } else if (key === 'username') {
          username = payload[key]
        } else if (key === 'password') {
          password = payload[key]
        }
      }
    }

    var credentials: Credentials = { password: password, email: '', username: '' }
    if (email) {
      credentials['email'] = email
      const user = await User.query()
        .where('email', credentials?.email)
        .first()
      if (!user) return response.status(404).send('The email address provided does not exist')

      if (!user?.verified)
        return response.unauthorized({
          success: false,
          message: 'You are not verified',
          data: {
            action: 'verification',
            email: user.email,
          },
        })

      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }

      const token = await auth.use('user').attempt(credentials?.email, credentials?.password)
      return response.json(token)
    } else if (username) {
      credentials['username'] = username
      const user = await User.query().where('username', username).first()
      //console.log(user?.toJSON())
      if (!user) return response.status(404).send('The username provided does not exist.')
      if (!user?.verified)
        return response.unauthorized({
          success: false,
          message: 'You are not verified',
          data: {
            action: 'verification',
            email: user.email,
          },
        })

      const passwordMatch = await Hash.verify(user.password, password)
      if (!passwordMatch) {
        return response.status(401).send('Invalid password')
      }

      const token = await auth.use('user').attempt(credentials.username, credentials.password)
      return response.json(token)
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const user = await auth.use('user').authenticate()
    const all = request.all()
    const file = request.file('filename')
    const fs = require('fs')
    fs.mkdirSync('/var/task/build/tmp', { recursive: true })

    try {
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
        return response.json({
          message: 'Failed to update data',
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(409).send('Something went wrong')
    }
  }

  public async generateOTP({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    try {
      const user = (await User.findBy('email', email)) || (await User.findBy('username', email))
      if (!user) {
        return response.unauthorized({ success: false, message: 'This email does not exist.' })
      }

      if (user.verified) {
        return response.unauthorized({
          success: false,
          message: 'This email address is already verified',
        })
      }
      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        digits: true,
        specialChars: false,
      })

      await Redis.set(`auth_${email}`, JSON.stringify({ email: email, otp: otp }))

      await Mail.use('smtp').send(
        (message) => {
          message.from('no-reply@njts.com')
          message.to(email)
          message.subject('NJTS: Account Verification')
          message.html(`
        ${otp}
      `)
        },
        {
          oTAGS: ['signup'],
        }
      )

      return response.json({
        success: true,
        message:
          'The verification code has been sent to your email address and it will expire in 60s',
        data: {
          user: user.email,
        },
      })
    } catch (error) {
      console.log(error)
      return response.badRequest({
        success: false,
        message: 'Somthing went wrong.',
      })
    }
  }

  public async verifyOTP({ request, response }: HttpContextContract) {
    const { email, otp } = request.only(['email', 'otp'])
    try {
      const client = await User.findBy('email', email)
      if (!client) {
        return response.unauthorized({ success: false, message: 'This email does not exist.' })
      }

      if (client.verified) {
        return response.unauthorized({
          success: false,
          message: 'This email address is already verified',
        })
      }
      const data = await Redis.get(`auth_${email}`)
      console.log('data', data)

      if (!data) {
        return response.unauthorized({
          success: false,
          message: 'This verification has expired.',
          data: {
            action: 'resend',
          },
        })
      }

      const data2 = JSON.parse(data)
      console.log('data2', data2)

      if (!(Number(data2.otp) === Number(otp))) {
        return response.unauthorized({
          success: false,
          message: 'This verification code is incorrect.',
          data: {
            action: 'resend',
          },
        })
      }

      const user = await User.findBy('email', email)
      if (!user) {
        return response.unauthorized({
          success: false,
          message: 'This email doest not exist.',
          data: {
            action: 'resend',
          },
        })
      }

      user.verified = true
      await user.save()
      await Redis.del(`auth_${email}`)
      return response.json({
        success: true,
        message: 'You have been verified',
        data: {
          action: 'login',
        },
      })
    } catch (error) {
      console.log(error)
      return response.serviceUnavailable({
        success: false,
        message: 'Could not verify the code. Try again.',
        data: {
          action: 'resend',
        },
      })
    }
  }
}
