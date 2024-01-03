import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

interface VariantType {
  name: string
  variation: string
}

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public itemId: number
  @column()
  public name: string
  @column()
  public delivering: boolean
  @column()
  public delivered: boolean
  @column()
  public canceled: boolean
  @column()
  public active: boolean
  @column()
  public collected: boolean
  @column()
  public location: string
  @column()
  public variant: VariantType
  @column()
  public userId: number
  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
