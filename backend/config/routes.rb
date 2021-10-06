# frozen_string_literal: true

# == Route Map
#
#           Prefix Verb   URI Pattern                 Controller#Action
# admin_operations GET    /admin/operations(.:format) admin/operations#index
#                  POST   /admin/operations(.:format) admin/operations#create
#            shops GET    /shops(.:format)            shops#index
#                  POST   /shops(.:format)            shops#create
#             shop GET    /shops/:id(.:format)        shops#show
#                  PATCH  /shops/:id(.:format)        shops#update
#                  PUT    /shops/:id(.:format)        shops#update
#                  DELETE /shops/:id(.:format)        shops#destroy
#            _ping GET    /_ping(.:format)            infrastructure/ping#get
#     _secure_ping GET    /_secure_ping(.:format)     infrastructure/ping#secure_get
#         _version GET    /_version(.:format)         infrastructure/version#get

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
