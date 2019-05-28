Rails.application.routes.draw do
  #devise_for :users
  mount ActionCable.server => '/cable'
  namespace :api do
    namespace :v1 do
      resources :ideas 
      	resources :boards 
      # resources :sessions, only: [:create, :destroy]
    end
  end
end
