'use client';

import { useState } from 'react';
import {
  Cpu,
  Zap,
  Send,
  MessageSquare,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Sparkles,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import ShadFooter from '../ShadFooter';
import { useRouter } from 'next/navigation';
import Preloader from '../Preloader';

export default function ContactSection() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
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
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      inquiryType: value
    });
  };

  return (
    <section className='relative overflow-hidden py-10 md:py-32'>
      {/* Minimal Background */}
      <Preloader />
      <div className='absolute inset-0 bg-white' />

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

      <div className='relative mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Alternative: Floating Back Button (more elegant) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='absolute top-0 -left-4 hidden lg:block'
        >
          <button
            onClick={handleBack}
            className='group flex items-center gap-3 text-sm text-gray-500 transition-all duration-300 hover:text-gray-700'
          >
            <div className='flex size-10 items-center justify-center rounded-full border border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm transition-all group-hover:shadow-md'>
              <ArrowLeft className='size-4 transition-transform group-hover:-translate-x-0.5' />
            </div>
            <span className='font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              Go back
            </span>
          </button>
        </motion.div>

        <div className='grid items-center gap-16 lg:grid-cols-2 lg:gap-24'>
          {/* Left Content - Minimalist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='space-y-8'
          >
            {/* Back button for mobile */}
            <div className='lg:hidden'>
              <button
                onClick={handleBack}
                className='group mb-8 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700'
              >
                <ChevronLeft className='size-4' />
                <span>Back to previous page</span>
              </button>
            </div>

            <div className='space-y-5'>
              {/* Subtle badge */}
              <div className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700'>
                <Sparkles className='size-3.5' />
                Contact Support
              </div>

              <h2 className='text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl lg:text-6xl'>
                How can we assist you today?
              </h2>

              <p className='text-lg leading-relaxed text-gray-600'>
                Our banking specialists are here to help with your financial
                needs. Get in touch for account support, service inquiries, or
                general assistance.
              </p>
            </div>

            {/* Minimal benefits */}
            <div className='space-y-6 pt-4'>
              <div className='flex items-start gap-4'>
                <div className='shrink-0'>
                  <div className='flex size-10 items-center justify-center rounded-lg border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100'>
                    <Zap className='size-4.5 text-blue-600' />
                  </div>
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>
                    Priority Banking Support
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Quick response for urgent banking matters
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='shrink-0'>
                  <div className='flex size-10 items-center justify-center rounded-lg border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100'>
                    <Cpu className='size-4.5 text-emerald-600' />
                  </div>
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>
                    Financial Experts
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Certified banking professionals ready to assist
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='shrink-0'>
                  <div className='flex size-10 items-center justify-center rounded-lg border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100'>
                    <MessageSquare className='size-4.5 text-purple-600' />
                  </div>
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>
                    24/7 Banking Support
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Round-the-clock assistance for your accounts
                  </p>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className='border-t border-gray-200 pt-6'>
              <div className='flex items-center gap-3'>
                <div className='size-2 rounded-full bg-emerald-400' />
                <span className='text-sm text-gray-600'>
                  Current response time:{' '}
                  <span className='font-medium'>Under 15 minutes</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card - Minimalist SaaS Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className='relative'
          >
            {/* Decorative accent */}
            <div className='absolute -top-4 -right-4 size-8 rotate-12 transform rounded-lg bg-linear-to-br from-blue-500 to-purple-500 opacity-10' />

            <Card className='overflow-hidden border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md'>
              {/* Minimal top accent */}
              <div className='absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-blue-400 to-purple-400' />

              <CardContent className='p-8'>
                <div className='space-y-7'>
                  {/* Form header */}
                  <div className='space-y-3 text-left'>
                    <h3 className='text-2xl font-semibold text-gray-900'>
                      Contact Banking Support
                    </h3>
                    <p className='text-sm text-gray-500'>
                      Fill out this form and a banking representative will
                      contact you shortly
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Name fields */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='space-y-2.5'>
                        <Label
                          htmlFor='firstName'
                          className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                        >
                          First Name
                        </Label>
                        <div className='relative'>
                          <User className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transform text-gray-400' />
                          <Input
                            id='firstName'
                            name='firstName'
                            placeholder='John'
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className='h-11 border-gray-300 pl-9 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                          />
                        </div>
                      </div>

                      <div className='space-y-2.5'>
                        <Label
                          htmlFor='lastName'
                          className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                        >
                          Last Name
                        </Label>
                        <Input
                          id='lastName'
                          name='lastName'
                          placeholder='Doe'
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className='h-11 border-gray-300 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className='space-y-2.5'>
                      <Label
                        htmlFor='email'
                        className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                      >
                        Email Address
                      </Label>
                      <div className='relative'>
                        <Mail className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transform text-gray-400' />
                        <Input
                          id='email'
                          name='email'
                          type='email'
                          placeholder='john@company.com'
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className='h-11 border-gray-300 pl-9 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='space-y-2.5'>
                        <Label
                          htmlFor='phone'
                          className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                        >
                          Phone Number
                        </Label>
                        <div className='relative'>
                          <Phone className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transform text-gray-400' />
                          <Input
                            id='phone'
                            name='phone'
                            type='tel'
                            placeholder='+1 (555) 123-4567'
                            value={formData.phone}
                            onChange={handleChange}
                            className='h-11 border-gray-300 pl-9 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                          />
                        </div>
                      </div>

                      <div className='space-y-2.5'>
                        <Label
                          htmlFor='company'
                          className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                        >
                          Company
                        </Label>
                        <div className='relative'>
                          <Building className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transform text-gray-400' />
                          <Input
                            id='company'
                            name='company'
                            placeholder='Acme Inc.'
                            value={formData.company}
                            onChange={handleChange}
                            className='h-11 border-gray-300 pl-9 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Website */}
                    <div className='space-y-2.5'>
                      <Label
                        htmlFor='website'
                        className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                      >
                        Website
                      </Label>
                      <div className='relative'>
                        <Globe className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 transform text-gray-400' />
                        <Input
                          id='website'
                          name='website'
                          placeholder='https://example.com'
                          value={formData.website}
                          onChange={handleChange}
                          className='h-11 border-gray-300 pl-9 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                        />
                      </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className='space-y-2.5'>
                      <Label
                        htmlFor='inquiryType'
                        className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                      >
                        Inquiry Type
                      </Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className='h-11 border-gray-300 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'>
                          <SelectValue placeholder='Select inquiry type' />
                        </SelectTrigger>
                        <SelectContent className='border-gray-300'>
                          <SelectItem value='general' className='text-sm'>
                            General Account Inquiry
                          </SelectItem>
                          <SelectItem value='business' className='text-sm'>
                            Business Banking
                          </SelectItem>
                          <SelectItem value='loans' className='text-sm'>
                            Loans & Mortgages
                          </SelectItem>
                          <SelectItem value='cards' className='text-sm'>
                            Credit/Debit Cards
                          </SelectItem>
                          <SelectItem value='technical' className='text-sm'>
                            Online Banking Support
                          </SelectItem>
                          <SelectItem value='fraud' className='text-sm'>
                            Fraud or Security Concern
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className='space-y-2.5'>
                      <Label
                        htmlFor='message'
                        className='text-xs font-medium tracking-wider text-gray-700 uppercase'
                      >
                        How can we help?
                      </Label>
                      <Textarea
                        id='message'
                        name='message'
                        placeholder='Please describe your banking question or concern...'
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className='resize-none border-gray-300 text-sm text-gray-700 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                      />
                      <p className='text-right text-xs text-gray-400'>
                        For security, avoid including sensitive account
                        information
                      </p>
                    </div>

                    {/* Checkboxes */}
                    <div className='space-y-4 pt-2'>
                      <div className='flex items-start space-x-3'>
                        <Checkbox
                          id='subscribe'
                          checked={formData.subscribe}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              subscribe: checked as boolean
                            })
                          }
                          className='border-gray-300 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500'
                        />
                        <label
                          htmlFor='subscribe'
                          className='text-sm leading-tight text-gray-600'
                        >
                          Receive banking updates, financial insights, and
                          service announcements
                        </label>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <Checkbox
                          id='terms'
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              acceptTerms: checked as boolean
                            })
                          }
                          required
                          className='border-gray-300 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500'
                        />
                        <label
                          htmlFor='terms'
                          className='text-sm leading-tight text-gray-600'
                        >
                          I agree to the{' '}
                          <a
                            href='#'
                            className='font-medium text-blue-500 hover:text-blue-600 hover:underline'
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href='#'
                            className='font-medium text-blue-500 hover:text-blue-600 hover:underline'
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type='submit'
                      className='h-11 w-full bg-linear-to-r from-blue-500 to-blue-600 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow'
                      disabled={isSubmitting || !formData.acceptTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <div className='mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className='mr-2 size-3.5' />
                          Submit to Banking Support
                        </>
                      )}
                    </Button>

                    {/* Privacy note */}
                    <p className='pt-2 text-center text-xs text-gray-400'>
                      Your information is protected with bank-grade security and
                      encryption
                    </p>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className='mt-6 flex items-center justify-center gap-6 text-xs text-gray-400'>
              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-emerald-400' />
                <span>Bank-Grade Security</span>
              </div>
              <div className='h-3 w-px bg-gray-300' />
              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-blue-400' />
                <span>FDIC Insured</span>
              </div>
              <div className='h-3 w-px bg-gray-300' />
              <div className='flex items-center gap-1.5'>
                <div className='size-2 rounded-full bg-purple-400' />
                <span>Confidential</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* <ShadFooter /> */}
    </section>
  );
}
