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
class Shop < ApplicationRecord
end
