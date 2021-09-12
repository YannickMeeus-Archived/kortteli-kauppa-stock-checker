# frozen_string_literal: true

module Sync
  class DownloadAllStoreData
    def self.execute
      retrieve_raw_product_data = RetrieveRawProductData.new
      Shop.find_each do |shop|
        data = retrieve_raw_product_data.for_shop(shop.name)
        IngestedProductInformation.create(shop: shop.id, raw_data: { products: data }) unless data.empty?
      end
    end
  end
end
