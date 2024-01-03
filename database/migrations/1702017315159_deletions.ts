import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'deletions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('resource_id').unsigned().notNullable()
      table.string('table_name').notNullable()
      table.date('deletionDate').notNullable()
      table.text('reasons').notNullable()
      table.integer('adminId').nullable().defaultTo(0)
      table.integer('admin_id').unsigned().references('id').inTable('admins').nullable()
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
