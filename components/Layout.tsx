import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, BookOpen, Home, Trophy, Users, User, LogOut, AlertCircle, Award } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', icon: Home, label: '首页' },
    { href: '/courses', icon: BookOpen, label: '课程' },
    { href: '/exams', icon: Award, label: '考试' },
    { href: '/storybooks', icon: BookOpen, label: '绘本' },
    { href: '/special-training', icon: BookOpen, label: '专项训练' },
    { href: '/wrong-questions', icon: AlertCircle, label: '错题本' },
    { href: '/progress', icon: Trophy, label: '进度' },
    { href: '/community', icon: Users, label: '社区' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">语言学习平台</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>退出</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <a href="/auth/login" className="text-sm text-gray-600 hover:text-primary-600">
                    登录
                  </a>
                  <a
                    href="/auth/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    注册
                  </a>
                </div>
              )}

              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="font-medium text-gray-900">语言学习平台</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 语言学习平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
