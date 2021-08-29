begin
  shop_names = %w[Kuninkaantammi Katajanokka Olari Painiitty Talinranta Keimolanmaki]
  shop_names.each { |shop_name| Shop.find_or_create_by(name: shop_name)}
rescue
  # Ignored
end


