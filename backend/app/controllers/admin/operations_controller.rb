# frozen_string_literal: true

module Admin
  class OperationsController < ApplicationController
    before_action :require_api_key

    def initialize
      super
      @acceptable_operations = ['purge_old_jobs']
      @delete_old_jobs = Maintenance::DeleteOldJobs.new
    end

    def index
      render status: 200, json: { available_jobs: @acceptable_operations }
    end

    def create
      potential_operation = params.require(:operation)
      return render status: :bad_request unless @acceptable_operations.include? potential_operation

      affected_job_ids = @delete_old_jobs.execute
      render status: :accepted, json: { accepted_operation: potential_operation, affected_records: affected_job_ids }
    end
  end
end
