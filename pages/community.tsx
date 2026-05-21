import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import { MessageCircle, Send, User, Clock, Plus, Search, UserPlus, CheckCircle2, Users } from 'lucide-react'
import { Post, Comment } from '@/types'

export default function Community() {
  const { data: session } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [showCreatePost, setShowCreatePost] = useState(false)
  
  // 好友功能状态
  const [friendships, setFriendships] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  useEffect(() => {
    if (session) {
      fetch('/api/friends')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFriendships(data)
          }
        })
        .catch(err => console.error('Error fetching friends:', err))
    }
  }, [session])

  useEffect(() => {
    if (selectedPost) {
      fetch(`/api/comments?postId=${selectedPost.id}`)
        .then(res => res.json())
        .then(data => setComments(data))
    }
  }, [selectedPost])
  
  // 搜索用户
  const handleSearchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim().length > 0) {
      try {
        const response = await fetch(`/api/friends?type=search&search=${encodeURIComponent(query)}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setSearchResults(data)
        }
      } catch (err) {
        console.error('Error searching users:', err)
      }
    } else {
      setSearchResults([])
    }
  }
  
  // 添加好友
  const handleAddFriend = async (friendId: string) => {
    if (!session) return
    
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setFriendships(prev => [...prev, data])
        alert('好友请求已发送！')
      } else {
        alert(`添加失败：${data.message || '未知错误'}`)
      }
    } catch (err) {
      console.error('Add friend error:', err)
      alert('添加好友失败，请稍后重试')
    }
  }
  
  // 获取用户与当前登录用户的关系状态
  const getFriendshipStatus = (userId: string) => {
    if (!Array.isArray(friendships)) return null
    const friendship = friendships.find(f => 
      (f.userId === userId || f.friendId === userId)
    )
    if (!friendship) return null
    return friendship.status
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session || !selectedPost) return

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: selectedPost.id,
        content: newComment,
      }),
    })

    if (response.ok) {
      const comment = await response.json()
      setComments(prev => [...prev, comment])
      setNewComment('')
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim() || !session) return

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })

    if (response.ok) {
      const post = await response.json()
      setPosts(prev => [post, ...prev])
      setNewPost({ title: '', content: '' })
      setShowCreatePost(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学习社区</h1>
          <p className="text-gray-500">与其他学习者交流分享</p>
        </div>
        <div className="flex items-center gap-3">
          {session && (
            <>
              <button
                onClick={() => router.push('/friends')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>好友</span>
              </button>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>发布帖子</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showCreatePost && session && (
        <Card className="p-6 mb-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">创建新帖子</h2>
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="帖子标题"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="分享你的学习心得..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                发布
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <Card
              key={post.id}
              className={`p-5 cursor-pointer transition-all duration-200 ${
                selectedPost?.id === post.id 
                  ? 'ring-2 ring-primary-500 bg-primary-50 border-primary-200 shadow-md' 
                  : 'hover:bg-gray-50 hover:shadow-sm'
              }`}
              onClick={() => {
                setSelectedPost(post)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{post.user?.name || '用户'}</span>
                      <span className="text-sm text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{formatDate(post.createdAt.toString())}</span>
                    </div>
                    {session && post.userId !== session.user.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddFriend(post.userId)
                        }}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>加好友</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-600 line-clamp-2">{post.content}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments?.length || 0} 评论</span>
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-4">
          {session && (
            <Card className="p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-5 w-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">搜索用户</h2>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="输入用户名或邮箱..."
                    value={searchQuery}
                    onChange={handleSearchUsers}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name || user.email}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddFriend(user.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>加好友</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {selectedPost ? (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">评论 ({comments.length})</h2>
              </div>
              <div className="space-y-4 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 text-sm">{comment.user?.name || '用户'}</span>
                          <span className="text-xs text-gray-400">{formatDate(comment.createdAt.toString())}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {session ? (
                <form onSubmit={handleSubmitComment}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="写下你的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">请登录后发表评论</p>
                  <a href="/auth/login" className="text-primary-600 text-sm hover:underline">登录</a>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">讨论区</h2>
              </div>
              <p className="text-gray-500 text-sm mb-4">选择一个帖子查看评论和参与讨论</p>
              <div className="space-y-2">
                {posts.slice(0, 3).map(post => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{formatDate(post.createdAt.toString())}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
