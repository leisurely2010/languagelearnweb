import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Card from '@/components/Card'
import { User, UserPlus, CheckCircle2, XCircle, Trash2, Users, Mail, Search, ArrowLeft } from 'lucide-react'

export default function Friends() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'sent'>('friends')
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [sentRequests, setSentRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [friendships, setFriendships] = useState<any[]>([])
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])
  
  useEffect(() => {
    if (session) {
      // 获取所有好友关系状态
      fetch('/api/friends')
        .then(res => res.json())
        .then(data => setFriendships(data))
      
      // 获取好友列表
      fetch('/api/friends?type=friends')
        .then(res => res.json())
        .then(data => setFriends(data))
      
      // 获取收到的好友请求
      fetch('/api/friends?type=pending')
        .then(res => res.json())
        .then(data => setPendingRequests(data))
      
      // 获取发送的好友请求
      fetch('/api/friends?type=sent')
        .then(res => res.json())
        .then(data => setSentRequests(data))
    }
  }, [session])
  
  // 搜索用户
  const handleSearchUsers = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim().length > 0) {
      const response = await fetch(`/api/friends?type=search&search=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data)
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
        // 需要获取完整的 friendship 对象（包含 friend 信息）
        // 重新获取 sent requests 来刷新数据
        fetch('/api/friends?type=sent')
          .then(res => res.json())
          .then(data => setSentRequests(data))
        
        // 刷新 friendships 列表
        fetch('/api/friends')
          .then(res => res.json())
          .then(data => setFriendships(data))
        
        alert('好友请求已发送！')
      } else {
        alert(`添加失败：${data.message || '未知错误'}`)
      }
    } catch (err) {
      console.error('Add friend error:', err)
      alert('添加好友失败，请稍后重试')
    }
  }
  
  // 接受好友请求
  const handleAcceptFriend = async (friendshipId: string) => {
    const response = await fetch('/api/friends', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendshipId, action: 'accept' }),
    })
    
    if (response.ok) {
      // 刷新列表
      fetch('/api/friends?type=friends')
        .then(res => res.json())
        .then(data => setFriends(data))
      setPendingRequests(prev => prev.filter(r => r.id !== friendshipId))
    }
  }
  
  // 拒绝好友请求
  const handleRejectFriend = async (friendshipId: string) => {
    const response = await fetch('/api/friends', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendshipId, action: 'reject' }),
    })
    
    if (response.ok) {
      setPendingRequests(prev => prev.filter(r => r.id !== friendshipId))
    }
  }
  
  // 删除好友
  const handleRemoveFriend = async (friendshipId: string) => {
    const response = await fetch('/api/friends', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendshipId }),
    })
    
    if (response.ok) {
      setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId))
    }
  }
  
  // 获取用户与当前登录用户的关系状态
  const getFriendshipStatus = (userId: string) => {
    const friendship = friendships.find(f => 
      (f.userId === userId || f.friendId === userId)
    )
    if (!friendship) return null
    return friendship.status
  }
  
  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">好友管理</h1>
        <p className="text-gray-500">管理你的学习好友</p>
      </div>
      
      {/* Tab 导航 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'friends' 
              ? 'bg-white text-primary-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>我的好友 ({friends.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'pending' 
              ? 'bg-white text-primary-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>收到的请求 ({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'sent' 
              ? 'bg-white text-primary-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          <span>发送的请求 ({sentRequests.length})</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Tab 内容 */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              {friends.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">还没有好友</h3>
                  <p className="text-gray-500">在社区搜索添加好友一起学习吧！</p>
                </Card>
              ) : (
                friends.map(friend => (
                  <Card key={friend.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{friend.name || friend.email}</p>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.friendshipId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">没有收到好友请求</h3>
                  <p className="text-gray-500">继续学习等待其他同学添加你！</p>
                </Card>
              ) : (
                pendingRequests.map(request => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.user?.name || request.user?.email}</p>
                          <p className="text-sm text-gray-500">想要添加你为好友</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcceptFriend(request.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>接受</span>
                        </button>
                        <button
                          onClick={() => handleRejectFriend(request.id)}
                          className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>拒绝</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'sent' && (
            <div className="space-y-4">
              {sentRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">没有发送好友请求</h3>
                  <p className="text-gray-500">在搜索栏查找同学添加好友！</p>
                </Card>
              ) : (
                sentRequests.map(request => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.friend?.name || request.friend?.email}</p>
                          <p className="text-sm text-yellow-600">等待对方接受...</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* 搜索侧边栏 */}
        <div className="lg:col-span-1">
          <Card className="p-5 sticky top-24">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-5 w-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">搜索添加好友</h2>
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
                  {searchResults.map(user => {
                    const status = getFriendshipStatus(user.id)
                    return (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{user.name || user.email}</p>
                          </div>
                        </div>
                        
                        {status === 'accepted' ? (
                          <span className="flex items-center space-x-1 text-green-600 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>好友</span>
                          </span>
                        ) : status === 'pending' ? (
                          <span className="text-yellow-600 text-sm">已发送</span>
                        ) : (
                          <button
                            onClick={() => handleAddFriend(user.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>加好友</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">未找到用户</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
