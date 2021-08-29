require 'rspec'
require 'spec_helper'
require 'rails_helper'
require 'vcr'

RSpec.describe 'RetrieveProductData' do
  before do
    # Do nothing
  end

  after do
    # Do nothing
  end

  context 'A call is made to the Kortteli Kauppa endpoint to retrieve products', :vcr do
    let(:raw_products_query) {Sync::RetrieveProductData.new}
    it 'returns a list of products' do
      raw_body = raw_products_query.for_shop('existing-shop')
      expect(raw_body).not_to be_nil
    end
  end
end