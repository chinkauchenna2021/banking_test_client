'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormContainer } from '@/components/auth/FormContainer'

export default function LoginPage() {
  const router = useRouter()
  const { login, error, clearError, isLoading } = useAuth()
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await login(loginData.email, loginData.password)
      setLoginSuccess(true)
      
      // Get the user data to check if admin
      const { user } = useAuth()
      
      // Redirect based on user role
      setTimeout(() => {
        if (user?.is_admin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }, 1500)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }


  const handleDemoLogin = async (type: 'user' | 'admin') => {
    clearError()
    
    const demoCredentials = {
      user: {
        email: 'user@demo.com',
        password: 'demo123',
      },
      admin: {
        email: 'admin@demo.com',
        password: 'admin123',
      }
    }

    try {
      await login(demoCredentials[type].email, demoCredentials[type].password)
      setLoginSuccess(true)
      
      // Since we can't access useAuth hook here synchronously,
      // we'll handle the redirection based on the login type
      setTimeout(() => {
        router.push(type === 'admin' ? '/admin' : '/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Demo login failed:', error)
    }
  }

  return (
    <FormContainer
      title="Welcome Back"
      description="Sign in to your account to continue"
    //   icon={<LogIn className="h-7 w-7 text-white" />}
      backText="Need an account? Sign up"
      backLink="/auth/register"
      footer={
        <div className="text-center text-xs text-gray-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Secure Connection • 256-bit Encryption</span>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleDemoLogin('user')}
            variant="outline"
            className="h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
            disabled={isLoading}
          >
            <span className="text-sm">User Demo</span>
          </Button>
          <Button
            onClick={() => handleDemoLogin('admin')}
            variant="outline"
            className="h-12 rounded-lg border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
            disabled={isLoading}
          >
            <span className="text-sm">Admin Demo</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                // prefix={<Mail className="h-5 w-5 text-gray-400" />}
                id="email"
                type="email"
                placeholder="you@example.com"
                style={{color: 'black'}}
                className="pl-12 h-12 text-base !text-black rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{color: 'black'}}
                className="pl-12 pr-12 h-12 !text-black rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={loginData.rememberMe}
                onCheckedChange={(checked) => setLoginData({...loginData, rememberMe: checked as boolean})}
                disabled={isLoading}
                className="h-5 w-5"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-sm">
              <AlertDescription className="text-red-700 text-sm">
                {error || 'Invalid email or password'}
              </AlertDescription>
            </Alert>
          )}

          {loginSuccess && (
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-sm">
              <AlertDescription className="text-green-800 text-sm">
                <strong>Login successful!</strong> Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base rounded-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={isLoading || loginSuccess}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </FormContainer>
  )
}