# frozen_string_literal: true

class ProductDownsyncJob < ApplicationJob
  queue_as :default

  def perform(*args)
    # Do something later
  end
end
