# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
shop_names = %w[Kuninkaantammi Katajanokka Olari Painiitty Talinranta Keimolanmaki]
shop_names.each { |shop_name| Shop.find_or_create_by(name: shop_name)}

