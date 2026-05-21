export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  level: number
  totalXP: number
  currentStreak: number
  totalWrongQuestions: number
  totalCorrectedQuestions: number
  specialTrainingTypeCompleted?: string
}

export interface Course {
  id: string
  title: string
  description: string
  language: string
  level: number
  category: string
  duration: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  order: number
  type: string
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  lessonId: string
  type: string
  question: string
  options: string
  answer: string
  feedback: string
}

export interface Progress {
  id: string
  userId: string
  courseId: string | null
  lessonId: string | null
  completed: boolean
  score: number | null
  completedAt: Date | null
}

export interface Achievement {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
}

export interface Post {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  user?: User
  comments?: Comment[]
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: Date
  user?: User
}

export interface LearningPath {
  id: string
  userId: string
  language: string
  level: number
}

export interface WrongQuestion {
  id: string
  userId: string
  exerciseId: string
  question: string
  options: string
  answer: string
  type: string
  courseId: string
  lessonId: string
  consecutiveCorrect: number
  wrongCount: number
  lastAttemptedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type SpecialTrainingType =
  | "PINYIN_TO_WORDS"
  | "SYNONYMS"
  | "ANTONYMS"
  | "IDIOMS"
  | "WORD_COLLOCATION"
  | "FILL_IN_BLANK"
  | "QUANTIFIERS"
  | "PUNCTUATION"

export interface SpecialTraining {
  id: string
  type: SpecialTrainingType
  language: string
  level: number
  title: string
  description: string
  createdAt: Date
  questions?: SpecialTrainingQuestion[]
  attempts?: SpecialTrainingAttempt[]
}

export interface SpecialTrainingQuestion {
  id: string
  trainingId: string
  order: number
  type: SpecialTrainingType
  question: string
  answer: string
  explanation?: string | null
  difficulty: number
  createdAt: Date
}

export interface SpecialTrainingAttempt {
  id: string
  userId: string
  trainingId: string
  score?: number | null
  completed: boolean
  completedAt?: Date | null
  createdAt: Date
  answers?: SpecialTrainingAnswer[]
}

export interface SpecialTrainingAnswer {
  id: string
  attemptId: string
  questionId: string
  userAnswer: string
  isCorrect: boolean
  createdAt: Date
}

export interface SpecialTrainingTypeProgress {
  type: SpecialTrainingType
  totalLevels: number
  completedLevels: number
  allCompleted: boolean
}

export interface StoryBook {
  id: string
  language: string
  level: number
  title: string
  description: string
  content: string
  coverImage?: string | null
  wordCount: number
  createdAt: Date
  questions?: StoryQuestion[]
  _count?: { questions: number }
  attempts?: StoryAttempt[]
}

export interface StoryQuestion {
  id: string
  storyId: string
  order: number
  type: string
  question: string
  options?: string | null
  answer: string
  explanation?: string | null
  difficulty: number
  createdAt: Date
}

export interface StoryAttempt {
  id: string
  userId: string
  storyId: string
  score?: number | null
  completed: boolean
  completedAt?: Date | null
  createdAt: Date
  answers?: StoryAnswer[]
}

export interface StoryAnswer {
  id: string
  attemptId: string
  questionId: string
  userAnswer: string
  isCorrect: boolean
  createdAt: Date
}
