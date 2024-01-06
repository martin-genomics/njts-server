import Mail from '@ioc:Adonis/Addons/Mail'
import otpGenerator from 'otp-generator'
import Redis from '@ioc:Adonis/Addons/Redis'

export default class MailService {
  public static async sendOTP(userEmail: string) {
    try {
      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        digits: true,
        specialChars: false,
      })

      await Redis.set(`auth_${userEmail}`, JSON.stringify({ email: userEmail, otp: otp }), 'EX', 60)

      await Mail.use('smtp').send(
        (message) => {
          message.from('no-reply@njts.com')
          message.to(userEmail)
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
}

// const mailService = new MailService()
// export default mailService
