# frozen_string_literal: true

module Admin
  class OperationsController < ApplicationController
    before_action :require_api_key

    def initialize
      super
      @acceptable_operations = ['purge_old_jobs' => Maintenance::DeleteOldJobs.new.execute.to_proc]
    end

    def index
      render status: 200, json: { available_jobs: @acceptable_operations.keys }
    end

    def create
      potential_operation = params.require(:operation)
      return render status: :bad_request unless @acceptable_operations.key? potential_operation

      results = @acceptable_operations.fetch(potential_operation).call
      render status: :accepted, json: { accepted_operation: potential_operation, results => results }
    end
  end
end
