require 'rails_helper'
require 'json'
RSpec.describe "Shops", type: :request do
  # Set up some shops to begin with
  let(:first_shop) { create :shop }
  let(:second_shop) { create :shop }
  let!(:existing_shops) {[first_shop, second_shop]}
  describe "GET /shops" do
    before do
      get shops_path
    end
    it 'should allow unauthenticated requests' do
      expect(response).to have_http_status(200)
    end
    it 'should return a data property' do
      json_response = JSON.parse(response.body)

      expect(json_response['data']).to_not be(nil)
    end
    it 'should return all existing shops' do
      json_response = JSON.parse(response.body)
      expect(json_response['data']).to include(first_shop.as_json)
      expect(json_response['data']).to include(second_shop.as_json)
    end
  end

  describe "POST /shops" do
    describe "When no API key is provided" do
      it 'should reject calls' do
        shop_to_try_and_create = build :shop
        post shops_path, :params => { shop: shop_to_try_and_create.as_json }
        expect(response).to have_http_status 403
      end
    end
  end
  describe "DELETE /shops" do
    describe "When no API key is provided" do
      let(:existing_shop) {create :shop}
      it 'should reject calls' do
        delete shop_path(existing_shop.id)
        expect(response).to have_http_status 403
      end
    end
  end
  private
end
