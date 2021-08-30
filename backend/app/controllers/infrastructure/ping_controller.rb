# frozen_string_literal: true

module Infrastructure
  class PingController < ApplicationController
    before_action :require_api_key, only: [:secure_get]
    def get
      render json: { data: '_pong' }
    end

    def secure_get
      render json: { data: '_secure_pong' }
    end
  end
end
