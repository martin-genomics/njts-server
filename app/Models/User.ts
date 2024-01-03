import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import PurchaseHistory from './PurchaseHistory'
import Wishlist from './Wishlist'
import Order from './Order'

export default class User extends BaseModel {
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
  public verified: boolean

  @column()
  public active: boolean

  @column()
  public phone: string

  @attachment({ folder: 'images' })
  public photo: AttachmentContract

  @hasMany(() => PurchaseHistory)
  public purchaseHistory: HasMany<typeof PurchaseHistory>

  @hasMany(() => Wishlist)
  public wishlist: HasMany<typeof Wishlist>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
