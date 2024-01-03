import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

interface VariantType {
  name: string
  variation: string
}

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: number

  @column()
  public variant: VariantType

  @column()
  public active: boolean
  @column()
  public userId: number

  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
