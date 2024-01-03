import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('firstname', 30)
      table.string('lastname', 30)
      table.string('username', 100).notNullable().unique()
      table.string('email', 200).notNullable().unique()
      table.string('password')
      table.boolean('admin')
      table.boolean('moderator')
      table.json('photo').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
