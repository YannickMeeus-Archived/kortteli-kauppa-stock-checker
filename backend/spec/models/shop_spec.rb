# frozen_string_literal: true

# == Schema Information
#
# Table name: shops
#
#  id         :uuid             not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_shops_on_name  (name) UNIQUE
#
require 'rails_helper'

RSpec.describe Shop, type: :model do
  context 'a newly created shop' do
    let(:created_shop) { create :shop }
    it 'should be generated with a UUID for an id' do
      expect(UUID.validate(created_shop.id)).to be(true)
    end
    it 'should have a unique name, no other shops can be created with said name' do
      existing_name = created_shop.name
      # TODO: This needs to be a more domain specific error but for now it's all gravy
      expect { Shop.create(name: existing_name) }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
