class CreateIngestedProductInformations < ActiveRecord::Migration[6.1]
  def change
    create_table :ingested_product_informations, id: :uuid do |t|
      t.uuid :shop
      t.jsonb :raw_data

      t.timestamps
    end
  end
end
