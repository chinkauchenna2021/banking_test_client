'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface FormContainerProps {
  title: string
  description: string
  children: ReactNode
  backLink?: string
  backText?: string
  footer?: ReactNode
  icon?: ReactNode
}

export function FormContainer({
  title,
  description,
  children,
  backLink = '/auth/login',
  backText = 'Back to Login',
  footer,
  icon
}: FormContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            {icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                {icon}
              </div>
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-600 mt-3 max-w-sm mx-auto text-sm">
              {description}
            </p>
          </div>

          {/* Form Card */}
          <Card className="border shadow-xl rounded-2xl overflow-hidden border-gray-200/50 backdrop-blur-sm bg-white/95">
            <CardContent className="pt-8 pb-6 px-6">
              {children}
            </CardContent>
            
            {/* Footer with back link */}
            <CardFooter className="border-t pt-6 pb-8 bg-gray-50/50 px-6">
              <div className="w-full space-y-4">
                {footer}
                <Link 
                  href={backLink} 
                  className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  {backText}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}