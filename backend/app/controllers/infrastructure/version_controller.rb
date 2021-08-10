class Infrastructure::VersionController < ApplicationController
  def get
    render json: {data: self.version}
  end

  private

  def version
    @version ||= VERSION.join('.')
  end
end
