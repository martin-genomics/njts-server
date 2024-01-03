import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Admin from './Admin'
import Moderator from './Moderator'

export default class FeaturedProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: number
  @column()
  public adminId?: number
  @column()
  public moderatorId?: number
  @belongsTo(() => Admin)
  public admin_id: BelongsTo<typeof Admin>

  @belongsTo(() => Moderator)
  public moderator_id: BelongsTo<typeof Moderator>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
