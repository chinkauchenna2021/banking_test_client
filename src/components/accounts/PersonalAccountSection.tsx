'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiCheck, FiShield, FiCreditCard, FiPercent, FiBell, FiLock } from 'react-icons/fi'

interface AccountFeature {
  icon: React.ReactNode
  title: string
  description: string
}

interface AccountBenefit {
  title: string
  points: string[]
}

const PersonalAccountSection = () => {
  const [activeTab, setActiveTab] = useState('benefits')

  const accountFeatures: AccountFeature[] = [
    {
      icon: <FiCheck className="text-green-500 text-2xl" />,
      title: "Instant Account Opening",
      description: "Open your account in minutes with our digital onboarding process"
    },
    {
      icon: <FiPercent className="text-blue-500 text-2xl" />,
      title: "Exciting Offers & Discounts",
      description: "Exclusive deals with our partner merchants"
    },
    {
      icon: <FiShield className="text-purple-500 text-2xl" />,
      title: "Secure Banking",
      description: "Military-grade encryption for all transactions"
    },
    {
      icon: <FiCreditCard className="text-red-500 text-2xl" />,
      title: "Reward Points",
      description: "Earn points on every transaction"
    }
  ]

  const accountBenefits: AccountBenefit[] = [
    {
      title: "Earn Interest up to 7%",
      points: ["High-yield savings", "Compound interest", "Daily accrual"]
    },
    {
      title: "Free SMS Alerts",
      points: ["Real-time notifications", "Transaction alerts", "Balance updates"]
    },
    {
      title: "Discounts on Locker",
      points: ["50% off first year", "Secure document storage", "24/7 access"]
    },
    {
      title: "International Debit Cards",
      points: ["Zero forex markup", "Global acceptance", "Contactless payments"]
    }
  ]

  const eligibilityCriteria = [
    { number: "1", title: "Nationality", description: "Residents & Non-Residents" },
    { number: "2", title: "Age", description: "18 Years or above" },
    { number: "3", title: "Minimum Balance", description: "$100 minimum deposit" },
    { number: "4", title: "Documents", description: "Valid ID & Proof of address" }
  ]

  return (
    <section className="personal-account-section py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get More From Your Money
          </h2>
          <p className="text-xl text-gray-600">
            Access your money anytime and anywhere
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {accountFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Image */}
          <div className="relative" data-aos="fade-right">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="/assets/images/resources/savings-account-hero.jpg"
                alt="Savings Account"
                width={600}
                height={500}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-4xl font-bold">2.3k</div>
              <div className="text-sm opacity-90">Accounts opened this month</div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:pl-8" data-aos="fade-left">
            <div className="mb-8">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                KNOW ABOUT
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Personal Savings Account
              </h3>
              <p className="text-gray-600 mb-6">
                Start your journey towards financial freedom with our high-yield savings account. 
                Enjoy competitive interest rates, zero hidden fees, and complete digital banking.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <FiCheck className="text-green-500 mr-3" />
                  <span>No minimum balance requirement</span>
                </div>
                <div className="flex items-center">
                  <FiCheck className="text-green-500 mr-3" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <FiCheck className="text-green-500 mr-3" />
                  <span>Instant money transfers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center">
                <FiCreditCard className="mr-2" />
                Open Account Now
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {['benefits', 'eligibility', 'documents', 'interest'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {accountBenefits.map((benefit, index) => (
                <div key={index} className="text-center p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-2xl">✨</div>
                  </div>
                  <h4 className="font-bold text-lg mb-3">{benefit.title}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {benefit.points.map((point, idx) => (
                      <li key={idx} className="flex items-center justify-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eligibilityCriteria.map((item, index) => (
                <div key={index} className="relative p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {item.number}
                  </div>
                  <h4 className="font-bold text-xl mb-3 mt-4">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-2xl mb-6 text-gray-900">Required Documents</h4>
                <div className="space-y-6">
                  {[
                    'Valid Government ID (Passport/Driver License)',
                    'Proof of Address (Utility Bill/Bank Statement)',
                    'Proof of Income (Salary Slip/Tax Returns)',
                    'Recent Passport-size Photographs',
                    'PAN Card (if applicable)'
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <FiCheck className="text-green-500 mr-4" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8">
                <h4 className="font-bold text-2xl mb-6">Quick Tips</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3">•</span>
                    <span>All documents must be clear and legible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3">•</span>
                    <span>Documents should not be older than 3 months</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3">•</span>
                    <span>Digital copies accepted for online applications</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'interest' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-4 px-6 text-left">Balance in Account</th>
                    <th className="py-4 px-6 text-left">Interest Rate</th>
                    <th className="py-4 px-6 text-left">Annual Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { balance: 'Up to $10,000', rate: '3.00%', yield: '$300' },
                    { balance: '$10,001 - $50,000', rate: '5.00%', yield: '$2,500' },
                    { balance: '$50,001 - $100,000', rate: '8.25%', yield: '$8,250' },
                    { balance: 'Above $100,000', rate: '10.00%', yield: 'Custom' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="py-4 px-6 font-semibold">{row.balance}</td>
                      <td className="py-4 px-6 text-green-600 font-bold">{row.rate}</td>
                      <td className="py-4 px-6">{row.yield}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600">Find answers to common questions</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                question: "What is the minimum balance requirement?",
                answer: "We have no minimum balance requirement. You can open an account with any amount."
              },
              {
                question: "How do I access my account online?",
                answer: "Download our mobile app or visit our website to access your account 24/7."
              },
              {
                question: "Are there any hidden fees?",
                answer: "No hidden fees. All charges are transparently displayed before any transaction."
              },
              {
                question: "How fast are money transfers?",
                answer: "Most transfers are instant. International transfers may take 1-2 business days."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="font-bold text-lg mb-3 text-gray-900">{faq.question}</div>
                <div className="text-gray-600">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalAccountSection