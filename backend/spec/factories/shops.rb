# frozen_string_literal: true

FactoryBot.define do
  factory :shop do
    name { "A Shop - #{SecureRandom.uuid}" }
  end
end
