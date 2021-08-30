# frozen_string_literal: true

class CreateShops < ActiveRecord::Migration[6.1]
  def change
    create_table :shops, id: :uuid do |t|
      t.string :name, index: { unique: true }

      t.timestamps
    end
  end
end
