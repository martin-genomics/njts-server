import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class PurchaseHistory extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public userId: number
  @column()
  public product_id: number
  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
