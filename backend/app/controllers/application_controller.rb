# frozen_string_literal: true

class ApplicationController < ActionController::API
  private

  def require_api_key
    render json: 'Access Denied', status: 403 unless request.headers['X-Api-Key'] == ENV['STATIC_API_KEY']
  end

  rescue_from ActionController::ParameterMissing do |exception|
    render json: { error: exception.message }, status: :bad_request
  end
end
