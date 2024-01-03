import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL

      table.string('name', 200)
      table.text('description')
      table.string('thumbnail')
      table.string('status') //PUBLISHED | DRAFT | SCHEDULED | INACTIVE
      table.string('category', 20)
      //INTEGERS
      //table.integer('admin_id').unsigned().references('admin.id').onDelete('CASCADE')
      table.bigint('price')
      table.json('default_currency').defaultTo({
        country: 'ZAMBIA',
        curreny: 'ZMW',
      })
      table.json('discount').defaultTo({
        percentage: 0,
        fixedPrice: 0,
      })
      table.string('tags', 900)
      table.bigint('tax').defaultTo(0)
      table.bigint('vat')
      table.json('media').defaultTo({
        images: [],
        videos: [],
      })
      table.json('reviews').defaultTo({
        users: [],
        admins: [],
        suppliers: [],
      })
      table.bigint('quantity').defaultTo(1)
      table.json('sizes').defaultTo({
        small: 0,
        medium: 0,
        large: 0,
        extra_large: 0,
      })
      table.json('shipping').defaultTo({
        status: false,
        locations: [],
      })
      table.json('variants').defaultTo({
        products: [],
      })
      table.string('barcode').nullable()
      table.string('sku').nullable()
      table.string('product_id').notNullable().unique()
      table.string('supplier').nullable()
      table.integer('adminId').nullable().defaultTo(0)
      table.integer('admin_id').unsigned().references('id').inTable('admins').nullable()
      table.integer('moderator_id').unsigned().references('id').inTable('moderators').nullable()
      table.string('search_status', 50)
      table.dateTime('published').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
