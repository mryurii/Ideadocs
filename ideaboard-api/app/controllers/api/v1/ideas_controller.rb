module Api::V1
  class IdeasController < ApplicationController

    def index
      @ideas = Idea.order(created_at: :asc)

      render json: @ideas
    end

    def create
      @idea = Idea.create(idea_params)

      ActionCable.server.broadcast(:ideas, event: :created, idea: @idea)

      render json: @idea
    end

    def update
      @idea = Idea.find(params[:id])
      @idea.update_attributes(idea_params)

      ActionCable.server.broadcast(:ideas, event: :updated, idea: @idea)

      render json: @idea
    end

    def destroy
      @idea = Idea.find(params[:id])

      if @idea.destroy
        ActionCable.server.broadcast(:ideas, event: :deleted, idea: @idea)

        head :no_content
      else
        render json: @idea.errors, status: :unprocessable_entity
      end
    end

    private

    def idea_params
    	params.require(:idea).permit(:title, :body, :color)
    end
  end
end

