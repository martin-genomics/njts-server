import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Admin from './Admin'

export default class Deletion extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public resource_id: number
  @column()
  public table_name: string
  @column.date()
  public deletionDate: DateTime
  @column()
  public reasons: string
  @column()
  public adminId: number
  @belongsTo(() => Admin)
  public admin_id: BelongsTo<typeof Admin>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
