import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    if (result?.error) {
      setError('邮箱或密码错误')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录你的账户继续学习</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="请输入邮箱地址"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>登录</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              还没有账户？{' '}
              <a href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                立即注册
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
