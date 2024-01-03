import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('itemId').notNullable()
      table.string('name')
      table.boolean('delivering').defaultTo(false)
      table.boolean('delivered').defaultTo(false)
      table.boolean('cancelled').defaultTo(false)
      table.boolean('active').defaultTo(true)
      table.boolean('collected').defaultTo(false)
      table.json('variant')
      table.string('location').defaultTo('within')
      table.integer('userId').unsigned().defaultTo(0)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
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
