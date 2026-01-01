'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  Shield,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { FormContainer } from '@/components/auth/FormContainer'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword, isLoading, error, clearError } = useAuth()
  
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [success, setSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
    }
  }, [token])

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 10
    
    if (/[A-Z]/.test(password)) strength += 15
    if (/[a-z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    
    setPasswordStrength(Math.min(strength, 100))
  }

  const handlePasswordChange = (password: string) => {
    setNewPassword(password)
    checkPasswordStrength(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!token) {
      setIsTokenValid(false)
      return
    }
    
    if (newPassword !== confirmPassword || passwordStrength < 60) {
      return
    }
    
    try {
      await resetPassword(token, newPassword)
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      console.error('Password reset failed:', error)
    }
  }

  if (!isTokenValid) {
    return (
      <FormContainer
        title="Invalid Link"
        description="This password reset link is invalid or has expired"
        // icon={<Shield className="h-7 w-7 text-white" />}
        backText="Request new reset link"
        backLink="/auth/forgot-password"
      >
        <div className="space-y-6">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-700 text-sm">
              <strong>Link Expired</strong> - Please request a new password reset link
            </AlertDescription>
          </Alert>
          
          <Button asChild className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <a href="/auth/forgot-password">
              Request New Reset Link
            </a>
          </Button>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer
      title="New Password"
      description="Create a strong password to secure your account"
      icon={<Shield className="h-7 w-7 text-white" />}
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                style={{color: 'black'}}
                className="pl-10 pr-10 h-11 rounded-lg text-slate-900 text-slate-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {newPassword && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength < 40 ? 'text-red-600' :
                    passwordStrength < 70 ? 'text-yellow-600' :
                    passwordStrength < 90 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {passwordStrength < 40 ? 'Weak' :
                     passwordStrength < 70 ? 'Moderate' :
                     passwordStrength < 90 ? 'Strong' : 'Very Strong'}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength} 
                  className={`h-1.5 ${
                    passwordStrength < 40 ? 'bg-red-500' :
                    passwordStrength < 70 ? 'bg-yellow-500' :
                    passwordStrength < 90 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                style={{color: 'black'}}
                className="pl-10 pr-10 h-11 rounded-lg text-slate-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword !== confirmPassword && confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Requirements:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>Minimum 8 characters</span>
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>One uppercase letter</span>
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>One number</span>
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  /[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span>One special character</span>
              </li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700 text-sm">
                {error || 'Failed to reset password. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={
              isLoading || 
              !newPassword || 
              !confirmPassword || 
              newPassword !== confirmPassword ||
              passwordStrength < 60
            }
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Password Reset Successful!</strong> Redirecting to login...
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-sm p-4">
            <h4 className="font-semibold text-green-800 mb-3 text-sm">All Set!</h4>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center gap-2">
                <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                  ✓
                </div>
                <span>Your password has been updated</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                  ✓
                </div>
                <span>You can now sign in with your new password</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                  ✓
                </div>
                <span>Consider enabling two-factor authentication</span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </FormContainer>
  )
}