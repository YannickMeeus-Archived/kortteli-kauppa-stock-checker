class Infrastructure::PingController < ApplicationController
  before_action :require_api_key, only: [:get_securely]
  def get
    render json: {data: "_pong"}
  end

  def get_securely
    render json: {data: "_secure_pong"}
  end
end
