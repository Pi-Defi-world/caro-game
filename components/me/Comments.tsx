export default function Comments() {
  const comments = [
    {
      id: 1,
      author: 'BlazeRunner',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'Speed, fire, and unstoppable energy - catch them if you can!',
      timestamp: '14:30',
    },
    {
      id: 2,
      author: 'ShadowFury',
      avatar: '/placeholder.svg?height=32&width=32',
      content: 'Master of stealth and strategy! Always one step ahead...',
      timestamp: '14:30',
    },
  ]

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Comments</h3>
        <span className="text-blue-400">6</span>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{comment.author}</span>
                <span className="text-gray-500 text-sm">{comment.timestamp}</span>
              </div>
              <p className="text-gray-400 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

