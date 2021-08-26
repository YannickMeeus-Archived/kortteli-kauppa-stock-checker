class ApplicationController < ActionController::API
  private

  def require_api_key
    unless request.headers['X-Api-Key'] == ENV['STATIC_API_KEY']
      render :json => 'Access Denied', :status => 403
    end
  end

  rescue_from ActionController::ParameterMissing do |exception|
    render json: { error: exception.message }, status: :bad_request
  end
end
