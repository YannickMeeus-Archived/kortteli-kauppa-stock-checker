class Infrastructure::PingController < ApplicationController
  def get
    render json: {data: "_pong"}
  end
end
