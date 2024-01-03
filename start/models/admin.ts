import Database from '@ioc:Adonis/Lucid/Database'
//import { DateTime } from 'luxon'
const admins = async () => {
  const data = await Database.from('admins').select('*')
  return data.map((admin) => {
    return admin
  })
}

export default admins
