import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Check, Volume2 } from 'lucide-react'

interface SpeakingExercise {
  text: string
  hint?: string
}

interface SpeakingPracticeProps {
  exercises: SpeakingExercise[]
  onComplete: (score: number) => void
}

export default function SpeakingPractice({ exercises, onComplete }: SpeakingPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const currentExercise = exercises[currentIndex]

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    
    recorder.start()
    setIsRecording(true)

    recorder.onstop = () => {
      stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setShowResult(true)
      const simulatedConfidence = Math.floor(Math.random() * 40) + 60
      setConfidence(simulatedConfidence)
      if (simulatedConfidence >= 70) {
        setScore(prev => prev + 1)
      }
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
  }

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowResult(false)
      setConfidence(0)
    } else {
      setCompleted(true)
      onComplete(score)
    }
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  if (completed) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">口语练习完成！</h2>
        <p className="text-gray-600">你的得分：{score}/{exercises.length}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">进度: {currentIndex + 1}/{exercises.length}</span>
        <span className="text-sm font-medium text-primary-600">得分: {score}</span>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-center mb-4">
          <button className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
            <Volume2 className="h-6 w-6 text-purple-600" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          {currentExercise.text}
        </h2>
        {currentExercise.hint && (
          <p className="text-center text-gray-500 text-sm">{currentExercise.hint}</p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {!showResult ? (
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`p-8 rounded-full transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white shadow-lg hover:shadow-xl`}
          >
            {isRecording ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
          </button>
        ) : (
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              confidence >= 70 ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <Check className={`h-10 w-10 ${confidence >= 70 ? 'text-green-500' : 'text-orange-500'}`} />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              匹配度: {confidence}%
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {confidence >= 70 ? '发音很棒！' : '继续练习，你可以做得更好！'}
            </p>
            <button
              onClick={handleNext}
              className="py-3 px-6 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              {currentIndex < exercises.length - 1 ? '下一题' : '查看结果'}
            </button>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-500">
          {isRecording ? '正在录音...' : '点击按钮开始录音'}
        </p>
      </div>
    </div>
  )
}
