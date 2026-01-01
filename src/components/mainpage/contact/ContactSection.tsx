'use client'

import { useState } from 'react'
import { Cpu, Zap, Send, MessageSquare, User, Mail, Phone, Building, Globe, Sparkles, ChevronLeft, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import ShadFooter from '../ShadFooter'
import { useRouter } from 'next/navigation'
import Preloader from '../Preloader'

export default function ContactSection() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    inquiryType: '',
    message: '',
    subscribe: true,
    acceptTerms: false
  })

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      inquiryType: '',
      message: '',
      subscribe: true,
      acceptTerms: false
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      inquiryType: value
    })
  }

  return (
    <section className="py-10 md:py-32 relative overflow-hidden">
      {/* Minimal Background */}
      <Preloader />
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle grid pattern */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-[0.03]" /> */}
      
      {/* Back Button Container - Fixed at top */}
      {/* <div className="fixed top-4 left-4 right-4 z-50 flex justify-center md:justify-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            onClick={handleBack}
            variant="outline"
            className="group relative border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-sm font-medium">Back</span>
            </div>
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Button>
        </motion.div>
      </div> */}

      <div className="mx-auto max-w-7xl px-4 -mt-20 sm:px-6 lg:px-8 relative">
        {/* Alternative: Floating Back Button (more elegant) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -left-4 top-0 hidden lg:block"
        >
          <button
            onClick={handleBack}
            className="group flex items-center gap-3 text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
          >
            <div className="flex items-center justify-center size-10 rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
              Go back
            </span>
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content - Minimalist */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Back button for mobile */}
            <div className="lg:hidden">
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
              >
                <ChevronLeft className="size-4" />
                <span>Back to previous page</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Subtle badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200">
                <Sparkles className="size-3.5" />
                Contact Support
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">
                How can we assist you today?
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Our banking specialists are here to help with your financial needs. 
                Get in touch for account support, service inquiries, or general assistance.
              </p>
            </div>

            {/* Minimal benefits */}
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
                    <Zap className="size-4.5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priority Banking Support</h3>
                  <p className="text-sm text-gray-500 mt-1">Quick response for urgent banking matters</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <Cpu className="size-4.5 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Financial Experts</h3>
                  <p className="text-sm text-gray-500 mt-1">Certified banking professionals ready to assist</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center">
                    <MessageSquare className="size-4.5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">24/7 Banking Support</h3>
                  <p className="text-sm text-gray-500 mt-1">Round-the-clock assistance for your accounts</p>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-gray-600">Current response time: <span className="font-medium">Under 15 minutes</span></span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card - Minimalist SaaS Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative accent */}
            <div className="absolute -top-4 -right-4 size-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 transform rotate-12 opacity-10" />
            
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              {/* Minimal top accent */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
              
              <CardContent className="p-8">
                <div className="space-y-7">
                  {/* Form header */}
                  <div className="text-left space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-900">Contact Banking Support</h3>
                    <p className="text-sm text-gray-500">Fill out this form and a banking representative will contact you shortly</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <Label htmlFor="firstName" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-gray-400" />
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="pl-9 h-11 text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2.5">
                        <Label htmlFor="lastName" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="h-11 text-sm border-gray-300 text-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-9 h-11 text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <Label htmlFor="phone" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-9 h-11 text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2.5">
                        <Label htmlFor="company" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Company
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-gray-400" />
                          <Input
                            id="company"
                            name="company"
                            placeholder="Acme Inc."
                            value={formData.company}
                            onChange={handleChange}
                            className="pl-9 h-11 text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Website */}
                    <div className="space-y-2.5">
                      <Label htmlFor="website" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Website
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-gray-400" />
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://example.com"
                          value={formData.website}
                          onChange={handleChange}
                          className="pl-9 h-11 text-sm text-gray-700  border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2.5">
                      <Label htmlFor="inquiryType" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Inquiry Type
                      </Label>
                      <Select  value={formData.inquiryType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="h-11 text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-300">
                          <SelectItem value="general" className="text-sm">General Account Inquiry</SelectItem>
                          <SelectItem value="business" className="text-sm">Business Banking</SelectItem>
                          <SelectItem value="loans" className="text-sm">Loans & Mortgages</SelectItem>
                          <SelectItem value="cards" className="text-sm">Credit/Debit Cards</SelectItem>
                          <SelectItem value="technical" className="text-sm">Online Banking Support</SelectItem>
                          <SelectItem value="fraud" className="text-sm">Fraud or Security Concern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2.5">
                      <Label htmlFor="message" className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        How can we help?
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your banking question or concern..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="text-sm text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right">For security, avoid including sensitive account information</p>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="subscribe" 
                          checked={formData.subscribe}
                          onCheckedChange={(checked) => setFormData({...formData, subscribe: checked as boolean})}
                          className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label
                          htmlFor="subscribe"
                          className="text-sm text-gray-600 leading-tight"
                        >
                          Receive banking updates, financial insights, and service announcements
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="terms" 
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
                          required
                          className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-gray-600 leading-tight"
                        >
                          I agree to the{' '}
                          <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow transition-all duration-300"
                      disabled={isSubmitting || !formData.acceptTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 size-3.5" />
                          Submit to Banking Support
                        </>
                      )}
                    </Button>

                    {/* Privacy note */}
                    <p className="text-xs text-center text-gray-400 pt-2">
                      Your information is protected with bank-grade security and encryption
                    </p>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-400" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-blue-400" />
                <span>FDIC Insured</span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-purple-400" />
                <span>Confidential</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* <ShadFooter /> */}
    </section>
  )
}