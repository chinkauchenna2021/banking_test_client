'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  Check,
  ChevronLeft,
  Calendar as CalendarIcon // Renamed import
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FormContainer } from '@/components/auth/FormContainer';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'; // Your calendar component
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError, isLoading } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: 'personal',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    acceptTerms: false,
    acceptPrivacy: false
  });

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;

    // Character type checks
    if (hasUpperCase) strength += 15;
    if (hasLowerCase) strength += 15;
    if (hasNumbers) strength += 15;
    if (hasSpecialChars) strength += 20;

    setPasswordStrength(Math.min(strength, 100));
    return { hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars };
  };

  // Validate step with toast feedback
  const validateStep = (stepNumber: number) => {
    const errors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!registrationData.firstName.trim()) {
          errors.firstName = 'First name is required';
        }
        if (!registrationData.lastName.trim()) {
          errors.lastName = 'Last name is required';
        }
        if (!registrationData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
          errors.email = 'Please enter a valid email address';
        }

        setValidationErrors(errors);

        // Show toast for validation errors
        if (Object.keys(errors).length > 0) {
          toast({
            title: 'Missing Information',
            description: 'Please fill in all required fields in Step 1.',
            variant: 'destructive'
          });
        }

        return Object.keys(errors).length === 0;

      case 2:
        if (!dateOfBirth) {
          errors.date_of_birth = 'Date of birth is required';
        } else {
          const today = new Date();
          const birthDate = new Date(dateOfBirth);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (age < 18) {
            errors.date_of_birth = 'You must be at least 18 years old';
          }
        }

        setValidationErrors(errors);

        // Show toast for validation errors
        if (Object.keys(errors).length > 0) {
          toast({
            title: 'Account Details Required',
            description: 'Please complete all account details.',
            variant: 'destructive'
          });
        }

        return Object.keys(errors).length === 0;

      case 3:
        const passwordChecks = checkPasswordStrength(registrationData.password);

        if (registrationData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        if (!passwordChecks.hasUpperCase) {
          errors.password =
            'Password must contain at least one uppercase letter';
        }
        if (!passwordChecks.hasLowerCase) {
          errors.password =
            'Password must contain at least one lowercase letter';
        }
        if (!passwordChecks.hasNumbers) {
          errors.password = 'Password must contain at least one number';
        }
        if (!passwordChecks.hasSpecialChars) {
          errors.password =
            'Password must contain at least one special character';
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        if (!registrationData.acceptTerms) {
          errors.acceptTerms = 'You must accept the Terms of Service';
        }
        if (!registrationData.acceptPrivacy) {
          errors.acceptPrivacy = 'You must accept the Privacy Policy';
        }
        if (passwordStrength < 60) {
          errors.passwordStrength = 'Password strength is too weak';
        }

        setValidationErrors(errors);

        // Show toast for validation errors
        if (Object.keys(errors).length > 0) {
          toast({
            title: 'Security Requirements',
            description: 'Please meet all password and agreement requirements.',
            variant: 'destructive'
          });
        }

        return Object.keys(errors).length === 0;

      default:
        return false;
    }
  };

  // Handle next step with toast feedback
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setValidationErrors({});

      // Show success toast for step completion
      toast({
        title: `Step ${step} Complete!`,
        description:
          step === 1
            ? 'Personal information saved. Now add account details.'
            : 'Account details saved. Now set up security.'
      });
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    if (!validateStep(3)) {
      toast({
        title: 'Validation Error',
        description: 'Please complete all required fields correctly.',
        variant: 'destructive'
      });
      return;
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
        date_of_birth: dateOfBirth ? formatDate(dateOfBirth) : '',
        accept_terms: registrationData.acceptTerms,
        is_admin: false
      };

      const response = await register(userData);
      setRegistrationSuccess(true);

      // Store email for verification page
      localStorage.setItem(
        'pending_verification_email',
        registrationData.email
      );

      toast({
        title: 'Registration Successful! 🎉',
        description:
          'Please check your email to verify your account before logging in.',
        duration: 5000
      });

      // Redirect to verification page
      setTimeout(() => {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(registrationData.email)}`
        );
      }, 2000);
    } catch (error: any) {
      const formatFieldLabel = (field: string) =>
        field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

      // Handle server validation errors
      const serverErrorList = error.response?.data?.errors;
      if (Array.isArray(serverErrorList) && serverErrorList.length > 0) {
        const serverErrors: Record<string, string> = {};
        const formattedMessages = serverErrorList
          .map((err: any) => {
            if (err.path) {
              serverErrors[err.path] = err.msg;
            }
            const message = err.msg || 'Invalid value';
            return err.path
              ? `${formatFieldLabel(err.path)}: ${message}`
              : message;
          })
          .filter(Boolean);

        setValidationErrors(serverErrors);

        const primaryMessage = formattedMessages[0];
        const extraCount = formattedMessages.length - 1;
        const description =
          extraCount > 0
            ? `${primaryMessage} (+${extraCount} more)`
            : primaryMessage;

        toast({
          title: 'Registration failed',
          description,
          variant: 'destructive',
          duration: 5000
        });
        return;
      }

      const fallbackMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Registration failed. Please try again.';
      toast({
        title: 'Registration failed',
        description: fallbackMessage,
        variant: 'destructive'
      });
    }
  };

  // Get step validation status
  const getStepStatus = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          registrationData.firstName.trim() !== '' &&
          registrationData.lastName.trim() !== '' &&
          registrationData.email.trim() !== '' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)
        );
      case 2:
        return dateOfBirth !== undefined;
      case 3:
        const { hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars } =
          checkPasswordStrength(registrationData.password);
        return (
          registrationData.password.length >= 8 &&
          hasUpperCase &&
          hasLowerCase &&
          hasNumbers &&
          hasSpecialChars &&
          registrationData.password === registrationData.confirmPassword &&
          registrationData.acceptTerms &&
          registrationData.acceptPrivacy &&
          passwordStrength >= 60
        );
      default:
        return false;
    }
  };

  return (
    <FormContainer
      title='Create Account'
      description='Join thousands of users banking with confidence'
      backText='Already have an account? Sign in'
      backLink='/auth/login'
    >
      <form onSubmit={handleRegister} className='space-y-6'>
        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='font-medium text-gray-700'>Step {step} of 3</span>
            <span className='text-gray-500'>
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Account Details'}
              {step === 3 && 'Security'}
            </span>
          </div>
          <Progress value={(step / 3) * 100} className='h-2' />
        </div>

        <AnimatePresence mode='wait'>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='firstName'
                    className='text-sm font-medium text-gray-700'
                  >
                    First Name *
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    className={`h-11 rounded-lg border-gray-300 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.first_name || validationErrors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    value={registrationData.firstName}
                    onChange={(e) => {
                      setRegistrationData({
                        ...registrationData,
                        firstName: e.target.value
                      });
                      if (validationErrors.firstName) {
                        setValidationErrors({
                          ...validationErrors,
                          firstName: ''
                        });
                      }
                    }}
                    required
                  />
                  {(validationErrors.first_name ||
                    validationErrors.firstName) && (
                    <p className='text-xs text-red-600'>
                      {validationErrors.first_name ||
                        validationErrors.firstName}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='lastName'
                    className='text-sm font-medium text-gray-700'
                  >
                    Last Name *
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    className={`h-11 rounded-lg border-gray-300 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.last_name || validationErrors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    value={registrationData.lastName}
                    onChange={(e) => {
                      setRegistrationData({
                        ...registrationData,
                        lastName: e.target.value
                      });
                      if (validationErrors.lastName) {
                        setValidationErrors({
                          ...validationErrors,
                          lastName: ''
                        });
                      }
                    }}
                    required
                  />
                  {(validationErrors.last_name ||
                    validationErrors.lastName) && (
                    <p className='text-xs text-red-600'>
                      {validationErrors.last_name || validationErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-gray-700'
                >
                  Email Address *
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  className={`h-11 rounded-lg border-gray-300 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  value={registrationData.email}
                  onChange={(e) => {
                    setRegistrationData({
                      ...registrationData,
                      email: e.target.value
                    });
                    if (validationErrors.email) {
                      setValidationErrors({
                        ...validationErrors,
                        email: ''
                      });
                    }
                  }}
                  required
                />
                {validationErrors.email && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='phone'
                  className='text-sm font-medium text-gray-700'
                >
                  Phone Number
                </Label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='(123) 456-7890'
                  className={`h-11 rounded-lg border-gray-300 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  value={registrationData.phone}
                  onChange={(e) => {
                    setRegistrationData({
                      ...registrationData,
                      phone: e.target.value
                    });
                    if (validationErrors.phone) {
                      setValidationErrors({
                        ...validationErrors,
                        phone: ''
                      });
                    }
                  }}
                />
                {validationErrors.phone && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.phone}
                  </p>
                )}
                <p className='text-xs text-gray-500'>Format: (XXX) XXX-XXXX</p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='accountType'
                  className='text-sm font-medium text-gray-700'
                >
                  Account Type *
                </Label>
                <Select
                  value={registrationData.accountType}
                  onValueChange={(value) =>
                    setRegistrationData({
                      ...registrationData,
                      accountType: value
                    })
                  }
                >
                  <SelectTrigger
                    className={`h-11 rounded-lg border-gray-300 text-gray-900 ${
                      validationErrors.account_type
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder='Select account type' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem
                      value='savings'
                      className='cursor-pointer text-gray-900 hover:bg-gray-100'
                    >
                      Savings Banking
                    </SelectItem>
                    <SelectItem
                      value='business'
                      className='cursor-pointer text-gray-900 hover:bg-gray-100'
                    >
                      Business Banking
                    </SelectItem>
                    <SelectItem
                      value='premium'
                      className='cursor-pointer text-gray-900 hover:bg-gray-100'
                    >
                      Premium Banking
                    </SelectItem>

                    <SelectItem
                      value='current'
                      className='cursor-pointer text-gray-900 hover:bg-gray-100'
                    >
                      Current Banking
                    </SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.account_type && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.account_type}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label className='text-sm font-medium text-gray-700'>
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={`h-11 w-full justify-start rounded-lg border-gray-300 text-left font-normal hover:border-gray-400 hover:bg-white ${
                        validationErrors.date_of_birth
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      } ${dateOfBirth ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4 text-gray-500' />
                      {dateOfBirth ? (
                        <span className='font-medium text-gray-900'>
                          {format(dateOfBirth, 'PPP')}
                        </span>
                      ) : (
                        <span className='text-gray-500'>
                          Select your date of birth
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto rounded-xl border border-gray-200 bg-white p-0 shadow-xl'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={dateOfBirth}
                      onSelect={(date: Date | undefined) => {
                        setDateOfBirth(date);
                        if (validationErrors.date_of_birth) {
                          setValidationErrors({
                            ...validationErrors,
                            date_of_birth: ''
                          });
                        }

                        // Show success toast when date is selected
                        if (date) {
                          toast({
                            title: 'Date Selected',
                            description: 'Birth date saved successfully.',
                            duration: 3000
                          });
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        const minDate = new Date();
                        minDate.setFullYear(today.getFullYear() - 100);
                        const maxDate = new Date();
                        maxDate.setFullYear(today.getFullYear() - 18);
                        return date > maxDate || date < minDate;
                      }}
                      initialFocus
                      captionLayout='dropdown-buttons'
                      fromYear={1920}
                      toYear={new Date().getFullYear() - 18}
                      showOutsideDays={false}
                      weekStartsOn={1}
                      className='rounded-md'
                      classNames={{
                        day_selected:
                          'bg-blue-600 text-white hover:bg-blue-700 hover:text-white',
                        day_today:
                          'bg-blue-50 text-blue-700 border border-blue-200'
                      }}
                    />

                    <div className='flex items-center justify-between border-t border-gray-100 p-3'>
                      <div className='text-xs text-gray-500'>
                        You must be at least 18 years old
                      </div>
                      {dateOfBirth && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setDateOfBirth(undefined)}
                          className='text-xs text-gray-600 hover:text-gray-900'
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {validationErrors.date_of_birth && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.date_of_birth}
                  </p>
                )}
              </div>
              <div className='rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4'>
                <h4 className='mb-2 text-sm font-semibold text-blue-800'>
                  Features Included:
                </h4>
                <ul className='space-y-1.5 text-sm text-blue-700'>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800'>
                      ✓
                    </div>
                    <span>No monthly maintenance fees</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800'>
                      ✓
                    </div>
                    <span>Free domestic transfers</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800'>
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
              key='step3'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Password *
                </Label>
                <div className='group relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Create a strong password'
                    className={`h-11 rounded-lg border-gray-300 pr-10 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    value={registrationData.password}
                    onChange={(e) => {
                      setRegistrationData({
                        ...registrationData,
                        password: e.target.value
                      });
                      checkPasswordStrength(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors({
                          ...validationErrors,
                          password: ''
                        });
                      }
                    }}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>

                {registrationData.password && (
                  <div className='space-y-1.5'>
                    <div className='flex justify-between text-xs'>
                      <span className='text-gray-500'>Password Strength</span>
                      <span
                        className={`font-medium ${
                          passwordStrength < 40
                            ? 'text-red-600'
                            : passwordStrength < 70
                              ? 'text-yellow-600'
                              : passwordStrength < 90
                                ? 'text-blue-600'
                                : 'text-green-600'
                        }`}
                      >
                        {passwordStrength < 40
                          ? 'Weak'
                          : passwordStrength < 70
                            ? 'Moderate'
                            : passwordStrength < 90
                              ? 'Strong'
                              : 'Very Strong'}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className={`h-1.5 ${
                        passwordStrength < 40
                          ? 'bg-red-500'
                          : passwordStrength < 70
                            ? 'bg-yellow-500'
                            : passwordStrength < 90
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                      }`}
                    />

                    {/* Show toast when password becomes strong */}
                    {passwordStrength >= 70 && passwordStrength < 80 && (
                      <p className='text-xs text-green-600'>
                        Good! Keep going for a stronger password
                      </p>
                    )}
                    {passwordStrength >= 90 && (
                      <p className='text-xs text-green-600'>
                        Excellent! Your password is very strong
                      </p>
                    )}
                  </div>
                )}

                {/* Password requirements */}
                <div className='mt-2 space-y-1 text-xs'>
                  <div
                    className={`flex items-center gap-2 ${
                      /[A-Z]/.test(registrationData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[A-Z]/.test(registrationData.password)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    At least one uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /[a-z]/.test(registrationData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[a-z]/.test(registrationData.password)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    At least one lowercase letter
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /\d/.test(registrationData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /\d/.test(registrationData.password)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    At least one number
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(registrationData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(registrationData.password)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    At least one special character
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      registrationData.password.length >= 8
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        registrationData.password.length >= 8
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    Minimum 8 characters
                  </div>
                </div>

                {validationErrors.password && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium text-gray-700'
                >
                  Confirm Password *
                </Label>
                <div className='group relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    className={`h-11 rounded-lg border-gray-300 pr-10 text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    value={registrationData.confirmPassword}
                    onChange={(e) => {
                      setRegistrationData({
                        ...registrationData,
                        confirmPassword: e.target.value
                      });
                      if (validationErrors.confirmPassword) {
                        setValidationErrors({
                          ...validationErrors,
                          confirmPassword: ''
                        });
                      }

                      // Show toast when passwords match
                      if (
                        e.target.value === registrationData.password &&
                        e.target.value.length > 0
                      ) {
                        toast({
                          title: 'Passwords Match!',
                          description: 'Your passwords are matching correctly.',
                          duration: 3000
                        });
                      }
                    }}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className='text-xs text-red-600'>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='acceptTerms'
                    checked={registrationData.acceptTerms}
                    onCheckedChange={(checked) => {
                      setRegistrationData({
                        ...registrationData,
                        acceptTerms: checked as boolean
                      });
                      if (validationErrors.acceptTerms) {
                        setValidationErrors({
                          ...validationErrors,
                          acceptTerms: ''
                        });
                      }

                      // Show toast when terms are accepted
                      if (checked) {
                        toast({
                          title: 'Terms Accepted',
                          description:
                            'Thank you for accepting our Terms of Service.',
                          duration: 3000
                        });
                      }
                    }}
                    required
                    className='border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600'
                  />
                  <label
                    htmlFor='acceptTerms'
                    className='text-xs leading-relaxed text-gray-600'
                  >
                    I agree to the{' '}
                    <a
                      href='/terms'
                      className='font-medium text-blue-600 hover:underline'
                    >
                      Terms of Service *
                    </a>
                  </label>
                </div>
                {validationErrors.acceptTerms && (
                  <p className='pl-9 text-xs text-red-600'>
                    {validationErrors.acceptTerms}
                  </p>
                )}

                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='acceptPrivacy'
                    checked={registrationData.acceptPrivacy}
                    onCheckedChange={(checked) => {
                      setRegistrationData({
                        ...registrationData,
                        acceptPrivacy: checked as boolean
                      });
                      if (validationErrors.acceptPrivacy) {
                        setValidationErrors({
                          ...validationErrors,
                          acceptPrivacy: ''
                        });
                      }

                      // Show toast when privacy policy is accepted
                      if (checked) {
                        toast({
                          title: 'Privacy Policy Accepted',
                          description:
                            'Thank you for accepting our Privacy Policy.',
                          duration: 3000
                        });
                      }
                    }}
                    required
                    className='border-gray-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600'
                  />
                  <label
                    htmlFor='acceptPrivacy'
                    className='text-xs leading-relaxed text-gray-600'
                  >
                    I have read and agree to the{' '}
                    <a
                      href='/privacy'
                      className='font-medium text-blue-600 hover:underline'
                    >
                      Privacy Policy *
                    </a>
                  </label>
                </div>
                {validationErrors.acceptPrivacy && (
                  <p className='pl-9 text-xs text-red-600'>
                    {validationErrors.acceptPrivacy}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display server errors */}
        {error && !Object.keys(validationErrors).length && (
          <Alert variant='destructive' className='border-red-200 bg-red-50'>
            <AlertDescription className='text-sm text-red-700'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {registrationSuccess && (
          <Alert className='border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'>
            <AlertDescription className='text-sm text-green-800'>
              <strong>Account created successfully!</strong> Please check your
              email to verify your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className='flex justify-between pt-4'>
          {step > 1 ? (
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setStep(step - 1);
                // Show toast for going back
                toast({
                  title: 'Going Back',
                  description: `Returning to Step ${step - 1}.`,
                  duration: 3000
                });
              }}
              className='h-11 rounded-lg border-gray-300 text-gray-700 hover:border-gray-400'
              disabled={isLoading || registrationSuccess}
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type='button'
              onClick={handleNextStep}
              className={`h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg ${
                step > 1 ? 'ml-auto' : 'w-full'
              }`}
              disabled={isLoading}
            >
              Continue
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          ) : (
            <Button
              type='submit'
              className={`h-11 rounded-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg ${
                step === 3 ? 'w-fit' : 'ml-auto'
              }`}
              disabled={isLoading || registrationSuccess}
            >
              {isLoading ? (
                <>
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check className='mr-2 h-4 w-fit' />
                  Complete Registration
                </>
              )}
            </Button>
          )}
        </div>

        {/* Step Indicators */}
        <div className='flex justify-center space-x-2 pt-4'>
          {[1, 2, 3].map((stepNumber) => (
            <button
              key={stepNumber}
              type='button'
              onClick={() => {
                if (stepNumber < step || getStepStatus(stepNumber - 1)) {
                  setStep(stepNumber);
                  // Show toast when clicking on step indicator
                  toast({
                    title: `Switching to Step ${stepNumber}`,
                    description: `Now editing ${
                      stepNumber === 1
                        ? 'Personal Info'
                        : stepNumber === 2
                          ? 'Account Details'
                          : 'Security'
                    }`,
                    duration: 3000
                  });
                } else {
                  // Show toast if step is not accessible
                  toast({
                    title: 'Step Locked',
                    description: 'Please complete the previous steps first.',
                    variant: 'destructive'
                  });
                }
              }}
              className={`h-2 w-8 rounded-full transition-all ${
                step === stepNumber
                  ? 'bg-blue-600'
                  : step > stepNumber
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              } ${
                stepNumber < step || getStepStatus(stepNumber - 1)
                  ? 'cursor-pointer hover:bg-blue-500'
                  : 'cursor-not-allowed'
              }`}
              disabled={isLoading}
            />
          ))}
        </div>
      </form>
    </FormContainer>
  );
}
