# frozen_string_literal: true

require 'faraday'
require 'faraday_middleware'

module Sync
  class RetrieveRawProductData
    def initialize
      @conn = Faraday.new do |f|
        f.response :json # decode response bodies as JSON
      end
    end

    def for_shop(shop_name)
      Rails.logger.debug("Downloading Data for Shop: '#{shop_name}'")
      response = @conn.get "http://188.166.11.123/Kortteliapp/api/cabin/list/v2/#{shop_name}"
      # Some product names contain good old Finnish alphabet characters, and Faraday needs to be..
      #  coerced to encode the body as utf-8
      products = response.body
      Rails.logger.debug("Found products: [#{products.length}]")
      products
    end
  end
end
