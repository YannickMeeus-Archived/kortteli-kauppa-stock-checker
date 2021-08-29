require 'faraday'

module Sync
  class RetrieveProductData
    def for_shop(shop_id)
      # match to external shop id (name)
      # pull all json through
      # dump all json into ingestedProductInformation

      response = Faraday.get 'http://188.166.11.123/Kortteliapp/api/cabin/list/v2/Kuninkaantammi'
      response.body
    end
  end
end