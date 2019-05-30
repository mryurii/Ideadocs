ideas = Idea.create(
	[
		{
			title: "Work on this shit",
			body: "Made of chocolate"
		},
		{
			title: "A twitter clinent idea",
			body: "Only for repwadawdwad"
		},
		{
			title: "wdawdwdwad",
			body: "wdawdwadawd"
		},
		{
			title: "dwadwadw",
			body: "dawdwadawd"
		}

	])

10.times do
	Idea.create(
		title: FFaker::Movie.title,
		body: FFaker::Lorem.phrase
	)
end

Board.create!(boardtitle: 'Explore board')
