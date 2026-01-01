'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Phone,
  ArrowRight,
  UserPlus,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormContainer } from '@/components/auth/FormContainer'

export default function RegisterPage() {
  const router = useRouter()
  const { register, error, clearError, isLoading } = useAuth()
  
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: 'personal',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
  })

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

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          registrationData.firstName.trim() !== '' &&
          registrationData.lastName.trim() !== '' &&
          registrationData.email.trim() !== '' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)
        )
      case 2:
        return true // Account type selection is optional or has default
      case 3:
        const isValid = (
          registrationData.password.length >= 8 &&
          registrationData.password === registrationData.confirmPassword &&
          registrationData.acceptTerms &&
          registrationData.acceptPrivacy &&
          passwordStrength >= 60
        )
        return isValid
      default:
        return false
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateStep(3)) {
      console.log('Validation failed:', {
        passwordLength: registrationData.password.length,
        passwordsMatch: registrationData.password === registrationData.confirmPassword,
        acceptTerms: registrationData.acceptTerms,
        acceptPrivacy: registrationData.acceptPrivacy,
        passwordStrength
      })
      return
    }
    
    try {
      const userData = {
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        account_type: registrationData.accountType,
        password: registrationData.password,
        password_confirmation: registrationData.confirmPassword,
        accept_terms: registrationData.acceptTerms,
      }
      
      await register(userData)
      setRegistrationSuccess(true)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <FormContainer
      title="Create Account"
      description="Join thousands of users banking with confidence"
    //   icon={<UserPlus className="h-7 w-7 text-white" />}
      backText="Already have an account? Sign in"
      backLink="/auth/login"
    >
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">
              Step {step} of 3
            </span>
            <span className="text-gray-500">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Account Type'}
              {step === 3 && 'Security'}
            </span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <div className="relative group">
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative group">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Type */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="accountType" className="text-sm font-medium text-gray-700">
                  Account Type
                </Label>
                <Select
                  value={registrationData.accountType}
                  onValueChange={(value) => setRegistrationData({...registrationData, accountType: value})}
                >
                  <SelectTrigger className="h-11 rounded-lg border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="personal" className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                      Personal Banking
                    </SelectItem>
                    <SelectItem value="business" className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                      Business Banking
                    </SelectItem>
                    <SelectItem value="premium" className="text-gray-900 hover:bg-gray-100 cursor-pointer">
                      Premium Banking
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Features Included:</h4>
                <ul className="text-sm text-blue-700 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>No monthly maintenance fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>Free domestic transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={registrationData.password}
                    onChange={(e) => {
                      setRegistrationData({...registrationData, password: e.target.value})
                      checkPasswordStrength(e.target.value)
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {registrationData.password && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength < 40 ? 'text-red-600' :
                        passwordStrength < 70 ? 'text-yellow-600' :
                        'text-green-600'
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
                    <div className="text-xs text-gray-500">
                      Minimum 8 characters with uppercase, lowercase, number, and special character
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <div className="relative group">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-11 rounded-lg border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    value={registrationData.confirmPassword}
                    onChange={(e) => setRegistrationData({...registrationData, confirmPassword: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registrationData.password !== registrationData.confirmPassword && registrationData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={registrationData.acceptTerms}
                    onCheckedChange={(checked) => setRegistrationData({...registrationData, acceptTerms: checked as boolean})}
                    required
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Terms of Service *
                    </a>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={registrationData.acceptPrivacy}
                    onCheckedChange={(checked) => setRegistrationData({...registrationData, acceptPrivacy: checked as boolean})}
                    required
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label htmlFor="acceptPrivacy" className="text-xs text-gray-600 leading-relaxed">
                    I have read and agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy *
                    </a>
                  </label>
                </div>
              </div>

              {/* Validation Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Requirements Status:</h4>
                <ul className="text-xs space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${registrationData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={registrationData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      Password at least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${registrationData.password === registrationData.confirmPassword && registrationData.password !== '' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={registrationData.password === registrationData.confirmPassword && registrationData.password !== '' ? 'text-green-600' : 'text-gray-500'}>
                      Passwords match
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${passwordStrength >= 60 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={passwordStrength >= 60 ? 'text-green-600' : 'text-gray-500'}>
                      Password strength sufficient
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${registrationData.acceptTerms ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={registrationData.acceptTerms ? 'text-green-600' : 'text-gray-500'}>
                      Terms of Service accepted
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${registrationData.acceptPrivacy ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={registrationData.acceptPrivacy ? 'text-green-600' : 'text-gray-500'}>
                      Privacy Policy accepted
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-700 text-sm">
              {error || 'Registration failed. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {registrationSuccess && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <AlertDescription className="text-green-800 text-sm">
              <strong>Account created successfully!</strong> Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons - ALWAYS VISIBLE */}
        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="h-11 rounded-lg border-gray-300 hover:border-gray-400 text-gray-700"
              disabled={isLoading || registrationSuccess}
            >
              Previous
            </Button>
          ) : (
            <div /> // Empty div to maintain spacing
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className={`h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-md hover:shadow-lg ${
                step > 1 ? 'ml-auto' : 'w-full'
              }`}
              disabled={!validateStep(step) || isLoading}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className={`h-11 rounded-sm !bg-gradient-to-r !from-green-600 !to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black transition-all shadow-md hover:shadow-lg ${
                step === 3 ? 'w-fit' : 'ml-auto'
              }`}
              disabled={!validateStep(3) || isLoading || registrationSuccess}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-fit" />
                  Complete Registration
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormContainer>
  )
}