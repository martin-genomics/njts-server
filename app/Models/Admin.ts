import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Product from './Product'
import Moderator from './Moderator'
import Deletion from './Deletion'
import FeaturedProduct from './FeaturedProduct'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string
  @column()
  public firstname: string

  @column()
  public lastname: string

  @attachment()
  public photo: AttachmentContract
  @hasMany(() => Moderator)
  public moderator_id: HasMany<typeof Moderator>
  @hasMany(() => Product)
  public products: HasMany<typeof Product>
  @hasMany(() => FeaturedProduct)
  public featuredProducts: HasMany<typeof FeaturedProduct>
  @hasMany(() => Deletion)
  public deletions: HasMany<typeof Deletion>
  @column()
  public moderator: boolean | undefined

  @column()
  public admin: boolean | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
