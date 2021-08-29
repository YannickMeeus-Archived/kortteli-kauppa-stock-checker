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
    let(:query) {Sync::RetrieveProductData.new}
    it 'returns a list of products' do
      products = query.for_shop('existing-shop')
      expect(products).not_to be_empty
    end
  end
end