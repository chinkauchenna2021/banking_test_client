'use client'

import { useState } from 'react'
import { Logo } from '../ark-component/logo'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MapPin, Building, Shield, Award, Phone, Mail, Clock, ChevronRight } from 'lucide-react'

const usefulLinks = [
  'Our Story',
  'Board of Directors',
  'Management Committee',
  'Media',
  'Investor Relations',
  'Awards & Recognition',
  'Careers'
]

const services = [
  'Savings Account',
  'Current Account',
  'Deposits',
  'Cards',
  'Trading & Demat a/c',
  'Insurance',
  'Locker Facility'
]

const legalLinks = [
  'Disclaimer',
  'Privacy Policy',
  'Terms & Conditions',
  'Online Security Tips'
]

const socialLinks = [
  { icon: 'youtube', label: 'YouTube', color: 'hover:text-red-600' },
  { icon: 'instagram', label: 'Instagram', color: 'hover:text-pink-600' },
  { icon: 'twitter', label: 'Twitter', color: 'hover:text-blue-400' },
  { icon: 'facebook-f', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: 'linkedin', label: 'LinkedIn', color: 'hover:text-blue-700' },
]

const branchLocations = [
  { value: 'canada', label: 'Canada' },
  { value: 'usa', label: 'USA' },
  { value: 'ksa', label: 'KSA' },
  { value: 'india', label: 'India' },
  { value: 'uk', label: 'United Kingdom' },
]

export default function ShadFooter() {
  const [selectedBranch, setSelectedBranch] = useState('')
  const [city, setCity] = useState('')

  const handleFindBranch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle branch find logic
    console.log({ selectedBranch, city })
  }

//   bg-gradient-to-b from-gray-50 to-white

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden pt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/images/patterns/grid-pattern.svg')] opacity-[0.02]" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" aria-label="go home" className="block size-fit">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2">
                  <Building className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-gray-200">FinBank</div>
                  <div className="text-sm text-gray-500">Trusted Banking Since 1995</div>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-600 leading-relaxed">
              Our goal is to help our customers achieve financial success through innovative 
              solutions and dedicated service. We maintain the highest standards of integrity 
              and excellence in all our operations.
            </p>
            
            {/* Awards */}
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2">
                  <Award className="size-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Banker&apos;s Bank of the Year 2023</h4>
                  <p className="text-sm text-gray-600">International Banking Awards</p>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-blue-600" />
                <span className="text-sm text-gray-600">24/7 Customer Support: <strong>1-800-555-BANK</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-blue-600" />
                <span className="text-sm text-gray-600">support@finbank.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-blue-600" />
                <span className="text-sm text-gray-600">Mon-Fri: 8AM-8PM, Sat: 9AM-4PM</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900 flex items-center gap-2 text-white">
              <div className="size-2 rounded-full bg-blue-600 " />
              Useful Links
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900 flex items-center gap-2 text-white">
              <div className="size-2 rounded-full bg-indigo-600" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Branch */}
          <div>
            <Card className="border-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-2">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Find Your Nearest Branch & ATM</h3>
                  <p className="text-sm text-gray-300">Locate our services near you</p>
                </div>
              </div>

              <form onSubmit={handleFindBranch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Select Branch</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Choose location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {branchLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value} className="hover:bg-gray-700">
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Enter City</label>
                  <Input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Find On Map
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Security Badge */}
        {/* <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-3">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">256-bit SSL Encryption</h4>
              <p className="text-sm text-gray-600">Your data is protected with bank-level security</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Trustpilot Rating</div>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10M+</div>
              <div className="text-sm text-gray-600">Customers Served</div>
            </div>
          </div>
        </div> */}

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FinBank Corporation. All rights reserved. Member FDIC.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href="#"
                aria-label={social.label}
                className={`rounded-lg bg-gray-100 p-2 text-gray-600 transition-all hover:scale-110 ${social.color}`}
              >
                <i className={`fab fa-${social.icon}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Regulatory Info */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              FinBank is regulated by the Office of the Comptroller of the Currency (OCC). 
              Deposits are FDIC insured up to $250,000 per depositor.
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs font-medium text-gray-700">FDIC</div>
              <div className="text-xs font-medium text-gray-700">OCC</div>
              <div className="text-xs font-medium text-gray-700">Equal Housing Lender</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" /> */}
    </footer>
  )
}