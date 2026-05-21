import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { language, level } = req.query
    
    let where: any = {}
    if (language) where.language = language
    if (level) where.level = parseInt(level as string)

    const courses = await prisma.course.findMany({
      where,
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: { exercises: true },
        },
      },
    })
    
    res.status(200).json(courses)
  } else if (req.method === 'POST') {
    const courseData = req.body
    const course = await prisma.course.create({
      data: courseData,
    })
    res.status(201).json(course)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
