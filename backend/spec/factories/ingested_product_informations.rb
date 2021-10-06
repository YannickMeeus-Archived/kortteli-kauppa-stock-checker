# frozen_string_literal: true

# == Schema Information
#
# Table name: ingested_product_informations
#
#  id         :uuid             not null, primary key
#  shop       :uuid
#  raw_data   :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :ingested_product_information do
    shop { '' }
    raw_data { '' }
  end
end
