# frozen_string_literal: true

module Infrastructure
  class VersionController < ApplicationController
    def get
      render json: { data: version }
    end

    private

    def version
      @version ||= VERSION.join('.')
    end
  end
end
