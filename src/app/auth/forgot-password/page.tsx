// app/auth/forgot-password/page.tsx - Forgot Password Page
'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormContainer } from '@/components/auth/FormContainer'

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      console.error('Password reset request failed:', error)
    }
  }

  return (
    <FormContainer
      title="Reset Your Password"
      description="Enter your email to receive password reset instructions"
    //   icon={<Shield className="h-7 w-7 text-white" />}
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                style={{color: 'black'}}
                className="pl-10 h-11 rounded-sm text-slate-900  border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500">
              We'll send you a secure link to reset your password
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700 text-sm">
                {error || 'Failed to send reset email. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
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
                <AlertDescription className="text-green-800">
                  <strong>Check your email!</strong> Password reset instructions have been sent to <span className="font-semibold">{email}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-4">
            <h4 className="font-semibold text-blue-800 mb-3 text-sm">Next Steps:</h4>
            <ol className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <span>Check your inbox for our email</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <span>Click the secure reset link (expires in 1 hour)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <span>Create a new strong password</span>
              </li>
            </ol>
          </div>
        </motion.div>
      )}
    </FormContainer>
  )
}