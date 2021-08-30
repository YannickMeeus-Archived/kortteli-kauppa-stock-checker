# frozen_string_literal: true

module Maintenance
  class DeleteOldJobs
    def execute
      deleted_jobs = GoodJob::Job.where("created_at < '#{1.hour.ago}'")
      affected_job_ids = deleted_jobs.pluck(:id)
      deleted_jobs.destroy_all
      affected_job_ids
    end
  end
end
