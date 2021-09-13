# frozen_string_literal: true

class ProductDownsyncJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    Sync::DownloadAllStoreData.execute
  end
end
