import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Review from './Review'
import Admin from './Admin'
import Moderator from './Moderator'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'

interface DefaultCurrency {
  currency: string
  country: string
}

interface Discount {
  percentage: number
  fixedPrice: number
}

interface Media {
  images: string[]
  videos: string[]
}

interface Sizes {
  small: number
  medium: number
  large: number
  extra_large: number
}

interface Shipping {
  status: boolean
  locations: string[]
}

interface Variants {
  name: string //x
  variation: string //size
  size: number //12
  price: number
}
interface MainVariants {
  products: Variants[]
}

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @attachment()
  public thumbnail: AttachmentContract
  @column()
  public description: string
  @column()
  public status: string
  @column()
  public category: string
  @column()
  public price: number
  @column()
  public default_currency: DefaultCurrency
  @column()
  public discount: Discount
  @column()
  public media: Media
  @column()
  public tax: number
  @column()
  public vat: number
  @column()
  public search_status: string
  @column()
  public shipping: Shipping
  @column()
  public quantity: number
  @column()
  public tags: string
  @column()
  public barcode?: string
  @column()
  public sku?: string
  @column()
  public published?: DateTime
  @column()
  public variants: MainVariants
  @column()
  public product_id: string
  @column()
  public supplier: string
  @column()
  public sizes: Sizes
  @column()
  public adminId: number
  @hasMany(() => Review)
  public review_id: HasMany<typeof Review>
  @belongsTo(() => Moderator)
  public moderator_id: BelongsTo<typeof Moderator>
  @belongsTo(() => Admin)
  public admin_id: BelongsTo<typeof Admin>
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
