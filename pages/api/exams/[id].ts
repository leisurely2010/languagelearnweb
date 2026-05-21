import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  console.log('Session data:', JSON.stringify(session, null, 2))
  console.log('Session user:', session.user)
  console.log('Session user id:', session.user?.id)

  if (!session.user || !session.user.id) {
    return res.status(401).json({ message: 'User not found in session' })
  }

  const examId = req.query.id as string

  if (req.method === 'GET') {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }
    
    res.status(200).json(exam)
  } else if (req.method === 'POST') {
    // 创建新的考试尝试
    try {
      console.log('Creating exam attempt with userId:', session.user.id, 'and examId:', examId)
      const examAttempt = await prisma.examAttempt.create({
        data: {
          userId: session.user.id,
          examId: examId,
        },
      })
      
      console.log('Created exam attempt:', examAttempt)
      res.status(201).json(examAttempt)
    } catch (error) {
      console.error('Error creating exam attempt:', error)
      res.status(500).json({ 
        message: 'Failed to create exam attempt',
        error: (error as Error).message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
