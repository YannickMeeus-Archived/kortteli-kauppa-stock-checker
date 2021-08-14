FactoryBot.define do
  factory :shop do
    name { "A Shop - " + SecureRandom.uuid }
  end
end
