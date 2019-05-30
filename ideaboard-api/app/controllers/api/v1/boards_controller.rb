module Api::V1
  class BoardsController < ApplicationController

	 def index
      @board = Board.all
      render json: @board
    end

    def create
      @board = Board.create(board_params)
      render json: @board
    end


	 def update
      @board = Board.find(params[:id])
      @board.update_attributes(board_params)

      ActionCable.server.broadcast 'boards', event: :updated, board: @board

      render json: @board
    end

  private
	def board_params
		params.require(:board).permit(:boardtitle)
		end
	end

end
