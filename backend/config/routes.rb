# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :admin do
    resources :operations, only: %i[create index]
  end

  resources :shops
  get '/_ping', to: 'infrastructure/ping#get'
  get '/_secure_ping', to: 'infrastructure/ping#secure_get'
  get '/_version', to: 'infrastructure/version#get'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
