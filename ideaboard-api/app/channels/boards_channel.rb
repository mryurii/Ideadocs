class BoardsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'boards'
  end

  def unsubscribed
    stop_all_streams
  end
end
