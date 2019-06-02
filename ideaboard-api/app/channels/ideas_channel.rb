class IdeasChannel < ApplicationCable::Channel
  def subscribed
     stream_from 'ideas'
  end

  def unsubscribed
     stop_all_streams
  end
end
