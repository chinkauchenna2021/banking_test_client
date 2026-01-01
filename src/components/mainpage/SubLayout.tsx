'use client'

import { useState } from 'react'
import { Logo } from '../ark-component/logo'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { MapPin, Building, Shield, Award, Phone, Mail, Clock, ChevronRight, Globe, Lock, Users, CheckCircle } from 'lucide-react'

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
  { icon: 'youtube', label: 'YouTube', color: 'hover:text-red-400' },
  { icon: 'instagram', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: 'twitter', label: 'Twitter', color: 'hover:text-blue-300' },
  { icon: 'facebook-f', label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: 'linkedin', label: 'LinkedIn', color: 'hover:text-blue-300' },
]

const branchLocations = [
  { value: 'canada', label: 'Canada' },
  { value: 'usa', label: 'USA' },
  { value: 'ksa', label: 'KSA' },
  { value: 'india', label: 'India' },
  { value: 'uk', label: 'United Kingdom' },
]

export default function FooterSection() {
  const [selectedBranch, setSelectedBranch] = useState('')
  const [city, setCity] = useState('')

  const handleFindBranch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle branch find logic
    console.log({ selectedBranch, city })
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/images/patterns/grid-pattern-dark.svg')] opacity-[0.03]" />
      
      {/* Glow Effects */}
      <div className="absolute -top-24 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-24 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/10 to-teal-500/10 blur-3xl" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" aria-label="go home" className="block size-fit">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
                  <Building className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-white">fidelityOffshoreBank</div>
                  <div className="text-sm text-gray-400">Trusted Banking Since 1995</div>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-400 leading-relaxed">
              Our goal is to help our customers achieve financial success through innovative 
              solutions and dedicated service. We maintain the highest standards of integrity 
              and excellence in all our operations.
            </p>
            
            {/* Awards */}
            <Card className="border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2 shadow-lg">
                  <Award className="size-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Banker&apos;s Bank of the Year 2023</h4>
                  <p className="text-sm text-gray-400">International Banking Awards</p>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-800 p-2">
                  <Phone className="size-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">24/7 Customer Support: <strong className="text-white">1-800-555-BANK</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-800 p-2">
                  <Mail className="size-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">support@fidelityOffshoreBank.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-800 p-2">
                  <Clock className="size-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">Mon-Fri: 8AM-8PM, Sat: 9AM-4PM</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
              <div className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              Useful Links
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    <span className="group-hover:text-blue-300 transition-colors">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white flex items-center gap-2">
              <div className="size-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    <span className="group-hover:text-indigo-300 transition-colors">{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Branch */}
          <div>
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 p-2 shadow-lg">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Find Your Nearest Branch & ATM</h3>
                  <p className="text-sm text-gray-400">Locate our services near you</p>
                </div>
              </div>

              <form onSubmit={handleFindBranch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Select Branch</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="bg-gray-900 border-gray-800 text-white hover:bg-gray-800">
                      <SelectValue placeholder="Choose location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                      {branchLocations.map((location) => (
                        <SelectItem 
                          key={location.value} 
                          value={location.value} 
                          className="hover:bg-gray-800 focus:bg-gray-800"
                        >
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Enter City</label>
                  <Input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 hover:bg-gray-800 focus:border-blue-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all hover:shadow-blue-500/25"
                >
                  Find On Map
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Security & Stats Section */}
        <div className="mt-12 grid gap-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-gray-900/30 p-8 backdrop-blur-sm lg:grid-cols-2">
          {/* Security Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-3 shadow-lg">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">256-bit SSL Encryption</h4>
                <p className="text-sm text-gray-400">Bank-level security protection</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-900/50 p-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Lock className="size-4" />
                  <span className="text-sm font-medium">FDIC Insured</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-white">$250K</div>
                <div className="text-xs text-gray-400">Per depositor</div>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Globe className="size-4" />
                  <span className="text-sm font-medium">Global Coverage</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Trustpilot Rating</span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-gray-400">/5</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-gray-300">Uptime</span>
              </div>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Guarantee</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Customers</span>
              </div>
              <div className="text-3xl font-bold text-white">10M+</div>
              <div className="text-sm text-gray-400">Served</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-amber-400" />
                <span className="text-sm font-medium text-gray-300">Years</span>
              </div>
              <div className="text-3xl font-bold text-white">28+</div>
              <div className="text-sm text-gray-400">Experience</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} fidelityOffshoreBank Corporation. All rights reserved. Member FDIC.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href="#"
                aria-label={social.label}
                className={`rounded-lg bg-gray-800/50 p-2.5 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-gray-800 hover:text-white ${social.color} backdrop-blur-sm`}
              >
                <i className={`fab fa-${social.icon}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Regulatory Info */}
        <div className="mt-6 rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-900/30 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              fidelityOffshoreBank is regulated by the Office of the Comptroller of the Currency (OCC). 
              Deposits are FDIC insured up to $250,000 per depositor.
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-800/50 px-3 py-1.5">
                <span className="text-xs font-medium text-gray-300">FDIC</span>
              </div>
              <div className="rounded-lg bg-gray-800/50 px-3 py-1.5">
                <span className="text-xs font-medium text-gray-300">OCC</span>
              </div>
              <div className="rounded-lg bg-gray-800/50 px-3 py-1.5">
                <span className="text-xs font-medium text-gray-300">Equal Housing Lender</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need assistance? Our website is compatible with screen readers. 
            <Link href="#" className="ml-1 text-blue-400 hover:text-blue-300">
              Learn about accessibility features
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute -bottom-8 left-1/2 h-32 w-full -translate-x-1/2 bg-gradient-to-t from-blue-500/5 to-transparent blur-2xl" />
    </footer>
  )
}