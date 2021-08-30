# frozen_string_literal: true

class ShopsController < ApplicationController
  before_action :set_shop, only: %i[show destroy]
  before_action :require_api_key, only: %i[create destroy]

  # GET /shops
  def index
    @shops = Shop.all

    render json: enveloped(@shops)
  end

  # GET /shops/1
  def show
    render json: @shop
  end

  # POST /shops
  def create
    @shop = Shop.new(shop_params)

    if @shop.save
      render json: @shop, status: :created, location: @shop
    else
      render json: @shop.errors, status: :unprocessable_entity
    end
  end

  # DELETE /shops/1
  def destroy
    @shop.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_shop
    @shop = Shop.find(params[:id])
  end

  def enveloped(to_wrap)
    { data: to_wrap }
  end

  # Only allow a list of trusted parameters through.
  def shop_params
    params.require(:shop).permit(:id, :key, :name)
  end
end
