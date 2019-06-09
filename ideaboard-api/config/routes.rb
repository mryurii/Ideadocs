Rails.application.routes.draw do
  # mount ActionCable.server => '/cable'

  namespace :api do
    namespace :v1 do
      resources :ideas
    	resources :boards
    end
  end
end
