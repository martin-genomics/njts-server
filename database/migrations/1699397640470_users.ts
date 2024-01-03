import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('firstname', 30)
      table.string('lastname', 30)
      table.boolean('verified').defaultTo(false)
      table.boolean('active').defaultTo(true)
      table.string('phone').nullable().unique()
      table.string('username', 100).notNullable().unique()
      table.string('email', 200).notNullable().unique()
      table.string('password')
      table.json('photo').nullable()
      //table.foreign('purchaseHistory', 'customer_id').references('id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
