class IdeasChannel < ApplicationCable::Channel
  def subscribed
     stream_from 'ideas'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
    def receive(data)
    idea = Idea.find(data["id"])
    idea.update!(idea: data["title", "body", "color"])
    ActionCable.server.broadcast('ideas', data)
  end
end
