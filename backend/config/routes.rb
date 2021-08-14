Rails.application.routes.draw do
  resources :shops
  get "/_ping", to: "infrastructure/ping#get"
  get "/_version", to: "infrastructure/version#get"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
