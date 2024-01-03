import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'moderators'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('firstname', 30)
      table.string('lastname', 30)
      table.boolean('verified').defaultTo(false)
      table.boolean('active').defaultTo(true)
      table.string('phone').nullable().unique()
      table.string('username', 100).notNullable().unique()
      table.string('email', 200).notNullable().unique()
      table.json('photo').nullable()
      table.string('password')
      table.integer('admin_id').unsigned().references('id').inTable('admins')
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
