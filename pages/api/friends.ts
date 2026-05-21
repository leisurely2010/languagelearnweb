import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userId = session.user.id

    if (req.method === 'GET') {
      const { type, search } = req.query

      // 搜索用户
      if (type === 'search' && search) {
        console.log('Searching for:', search)
        const searchTerm = String(search).toLowerCase()
        
        // SQLite不支持mode: 'insensitive'，先获取所有用户再过滤
        const users = await prisma.user.findMany({
          where: {
            id: { not: userId }
          }
        })
        
        console.log('All users found:', users.map(u => ({ id: u.id, name: u.name, email: u.email })))
        
        // 手动过滤
        const filteredUsers = users.filter(user => {
          const nameMatch = user.name?.toLowerCase().includes(searchTerm)
          const emailMatch = user.email?.toLowerCase().includes(searchTerm)
          return nameMatch || emailMatch
        }).slice(0, 10)
        
        console.log('Filtered users:', filteredUsers.map(u => ({ id: u.id, name: u.name, email: u.email })))
        return res.status(200).json(filteredUsers)
      }
      
      // 获取好友列表（已接受的）
      if (type === 'friends') {
        try {
          const friendships = await prisma.friendship.findMany({
            where: {
              OR: [
                { userId, status: 'accepted' },
                { friendId: userId, status: 'accepted' }
              ]
            }
          })
          
          const friendIds = friendships.map(f => 
            f.userId === userId ? f.friendId : f.userId
          )
          
          const friends = await prisma.user.findMany({
            where: { id: { in: friendIds } }
          })
          
          const result = friends.map(friend => {
            const friendship = friendships.find(fr => 
              fr.userId === friend.id || fr.friendId === friend.id
            )
            return {
              ...friend,
              friendshipId: friendship?.id
            }
          })
          
          return res.status(200).json(result)
        } catch (dbErr) {
          console.error('Database friends error:', dbErr)
          return res.status(200).json([])
        }
      }
      
      // 收到的好友请求
      if (type === 'pending') {
        try {
          const friendRequests = await prisma.friendship.findMany({
            where: {
              friendId: userId,
              status: 'pending'
            }
          })
          
          const userIds = friendRequests.map(f => f.userId)
          const users = await prisma.user.findMany({
            where: { id: { in: userIds } }
          })
          
          const result = friendRequests.map(request => {
            const user = users.find(u => u.id === request.userId)
            return {
              ...request,
              user
            }
          })
          
          return res.status(200).json(result)
        } catch (dbErr) {
          console.error('Database pending error:', dbErr)
          return res.status(200).json([])
        }
      }
      
      // 发送的好友请求
      if (type === 'sent') {
        try {
          const sentRequests = await prisma.friendship.findMany({
            where: {
              userId,
              status: 'pending'
            }
          })
          
          const friendIds = sentRequests.map(f => f.friendId)
          const friends = await prisma.user.findMany({
            where: { id: { in: friendIds } }
          })
          
          const result = sentRequests.map(request => {
            const friend = friends.find(f => f.id === request.friendId)
            return {
              ...request,
              friend
            }
          })
          
          return res.status(200).json(result)
        } catch (dbErr) {
          console.error('Database sent error:', dbErr)
          return res.status(200).json([])
        }
      }
      
      // 获取所有好友关系
      try {
        const friendships = await prisma.friendship.findMany({
          where: {
            OR: [
              { userId },
              { friendId: userId }
            ]
          }
        })
        return res.status(200).json(friendships)
      } catch (dbErr) {
        console.error('Database friendships error:', dbErr)
        return res.status(200).json([])
      }
    }

    if (req.method === 'POST') {
      const { friendId } = req.body
      
      console.log('Add friend request - userId:', userId, 'friendId:', friendId)
      
      if (!friendId) {
        return res.status(400).json({ message: 'Friend ID required' })
      }

      if (friendId === userId) {
        return res.status(400).json({ message: 'Cannot add yourself' })
      }

      try {
        const existing = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId, friendId },
              { userId: friendId, friendId: userId }
            ]
          }
        })

        if (existing) {
          console.log('Friendship already exists:', existing)
          return res.status(400).json({ message: 'Friendship already exists', status: existing.status })
        }

        console.log('Creating friendship...')
        const friendship = await prisma.friendship.create({
          data: {
            userId,
            friendId,
            status: 'pending'
          }
        })
        console.log('Friendship created:', friendship)

        return res.status(200).json(friendship)
      } catch (dbErr) {
        console.error('Database create error:', dbErr)
        return res.status(500).json({ message: 'Failed to add friend' })
      }
    }

    if (req.method === 'PUT') {
      const { friendshipId, action } = req.body
      
      try {
        const friendship = await prisma.friendship.findUnique({
          where: { id: friendshipId }
        })

        if (!friendship) {
          return res.status(404).json({ message: 'Friendship not found' })
        }

        if (friendship.friendId !== userId) {
          return res.status(403).json({ message: 'Not authorized' })
        }

        let updatedFriendship
        if (action === 'accept') {
          updatedFriendship = await prisma.friendship.update({
            where: { id: friendshipId },
            data: { status: 'accepted' }
          })
        } else if (action === 'reject') {
          updatedFriendship = await prisma.friendship.update({
            where: { id: friendshipId },
            data: { status: 'rejected' }
          })
        } else {
          return res.status(400).json({ message: 'Invalid action' })
        }

        return res.status(200).json(updatedFriendship)
      } catch (dbErr) {
        console.error('Database update error:', dbErr)
        return res.status(500).json({ message: 'Failed to update friend request' })
      }
    }

    if (req.method === 'DELETE') {
      const { friendshipId } = req.body
      
      try {
        const friendship = await prisma.friendship.findUnique({
          where: { id: friendshipId }
        })

        if (!friendship) {
          return res.status(404).json({ message: 'Friendship not found' })
        }

        if (friendship.userId !== userId && friendship.friendId !== userId) {
          return res.status(403).json({ message: 'Not authorized' })
        }

        await prisma.friendship.delete({
          where: { id: friendshipId }
        })

        return res.status(200).json({ message: 'Friendship deleted' })
      } catch (dbErr) {
        console.error('Database delete error:', dbErr)
        return res.status(500).json({ message: 'Failed to remove friend' })
      }
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
