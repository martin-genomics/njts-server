import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Admin from './Admin'
import Product from './Product'
import FeaturedProduct from './FeaturedProduct'

export default class Moderator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public verified: boolean

  @column()
  public active: boolean

  @attachment()
  public photo: AttachmentContract

  @column()
  public password: string

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @hasMany(() => FeaturedProduct)
  public featuredProducts: HasMany<typeof FeaturedProduct>

  @belongsTo(() => Admin)
  public admin_id: BelongsTo<typeof Admin>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
