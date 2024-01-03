import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'featured_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('product_id').unsigned().unique().notNullable()

      table.integer('adminId').nullable().defaultTo(0)

      table.integer('admin_id').unsigned().references('id').inTable('admins').nullable()

      table.integer('moderatorId').unsigned().defaultTo(0)

      table.integer('moderator_id').unsigned().references('id').inTable('moderators').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
