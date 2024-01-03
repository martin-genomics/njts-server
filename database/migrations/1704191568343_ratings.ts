import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('rating').unsigned().notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
