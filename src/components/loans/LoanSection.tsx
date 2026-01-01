'use client'

import { useState } from 'react'
import { FiHome, FiCreditCard, FiBriefcase, FiBook, FiDollarSign, FiClock, FiCheck } from 'react-icons/fi'

interface LoanType {
  id: number
  icon: React.ReactNode
  title: string
  description: string
  interestRate: string
  amountRange: string
  tenure: string
  features: string[]
  color: string
}

interface ApplicationStep {
  number: number
  title: string
  description: string
  icon: React.ReactNode
}

const LoanSection = () => {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [loanTenure, setLoanTenure] = useState(12)
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null)
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    amount: '',
    purpose: ''
  })

  const loanTypes: LoanType[] = [
    {
      id: 1,
      icon: <FiHome className="text-3xl" />,
      title: 'Home Loan',
      description: 'Buy your dream home with flexible repayment options',
      interestRate: '3.5% - 7.5%',
      amountRange: '$50,000 - $5,000,000',
      tenure: '5 - 30 years',
      features: ['Low interest rates', 'Quick approval', 'Flexible tenure'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      icon: <FiCreditCard className="text-3xl" />,
      title: 'Vehicle Loan',
      description: 'Finance your car, bike, or commercial vehicle',
      interestRate: '5.5% - 10.5%',
      amountRange: '$5,000 - $200,000',
      tenure: '1 - 7 years',
      features: ['100% on-road funding', 'Fast processing', 'Insurance included'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      icon: <FiBriefcase className="text-3xl" />,
      title: 'Personal Loan',
      description: 'Instant loans for all your personal needs',
      interestRate: '8.5% - 15.5%',
      amountRange: '$1,000 - $100,000',
      tenure: '1 - 5 years',
      features: ['No collateral', 'Digital process', 'Quick disbursal'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      icon: <FiBook className="text-3xl" />,
      title: 'Education Loan',
      description: 'Invest in your future with education financing',
      interestRate: '4.5% - 9.5%',
      amountRange: '$10,000 - $500,000',
      tenure: '5 - 15 years',
      features: ['Moratorium period', 'Tax benefits', 'Global coverage'],
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const applicationSteps: ApplicationStep[] = [
    {
      number: 1,
      title: 'Apply Here',
      description: 'Fill our simple online application form',
      icon: <FiCheck className="text-xl" />
    },
    {
      number: 2,
      title: 'Get Call Back',
      description: 'Our expert will contact you within 24 hours',
      icon: <FiClock className="text-xl" />
    },
    {
      number: 3,
      title: 'Process Your Request',
      description: 'Quick verification and loan disbursal',
      icon: <FiDollarSign className="text-xl" />
    }
  ]

  const calculateEMI = () => {
    const principal = loanAmount
    const rate = 0.085 / 12 // 8.5% annual interest
    const time = loanTenure
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1)
    return emi.toFixed(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Application submitted:', applicationData)
    // Handle form submission
  }

  return (
    <section className="loan-section py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Finance Your Dreams
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Customized loan solutions with competitive rates and flexible repayment options
          </p>
        </div>

        {/* Loan Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {loanTypes.map((loan) => (
            <div 
              key={loan.id}
              onClick={() => setSelectedLoan(loan.id)}
              className={`relative bg-gradient-to-br ${loan.color} text-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedLoan === loan.id ? 'ring-4 ring-white/50' : ''
              }`}
            >
              <div className="absolute top-6 right-6 bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                {loan.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{loan.title}</h3>
              <p className="opacity-90 mb-6">{loan.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Interest Rate</span>
                  <span className="font-bold">{loan.interestRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Amount Range</span>
                  <span className="font-bold">{loan.amountRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Tenure</span>
                  <span className="font-bold">{loan.tenure}</span>
                </div>
              </div>

              <button className="mt-8 w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Application Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Application Process
            </h2>
            <p className="text-gray-600">Get your loan approved in 3 easy steps</p>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {applicationSteps.map((step, index) => (
                <div key={step.number} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* EMI Calculator */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h3>
            
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Loan Amount</span>
                <span className="font-bold text-blue-600">${loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$1,000</span>
                <span>$1,000,000</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Loan Tenure</span>
                <span className="font-bold text-blue-600">{loanTenure} months</span>
              </div>
              <input
                type="range"
                min="6"
                max="84"
                step="1"
                value={loanTenure}
                onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>6 months</span>
                <span>7 years</span>
              </div>
            </div>

            {/* EMI Result */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Monthly EMI</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">${calculateEMI()}</div>
                <div className="text-gray-600">
                  For ${loanAmount.toLocaleString()} over {loanTenure} months
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300">
              Apply with These Terms
            </button>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for Loan</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={applicationData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Loan Type</label>
                  <select
                    name="loanType"
                    value={applicationData.loanType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Loan Type</option>
                    <option value="home">Home Loan</option>
                    <option value="vehicle">Vehicle Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="education">Education Loan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Loan Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={applicationData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$25,000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Loan Purpose</label>
                <textarea
                  name="purpose"
                  value={applicationData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of what you need the loan for..."
                  required
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-gray-700">
                  I agree to the terms and conditions
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Loans?
            </h2>
            <p className="text-gray-600">Benefits that make us stand out</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Fast Approval',
                description: 'Get approval within 24 hours'
              },
              {
                icon: '🏆',
                title: 'Low Interest Rates',
                description: 'Competitive rates starting from 3.5%'
              },
              {
                icon: '🛡️',
                title: 'No Hidden Charges',
                description: 'Complete transparency in all fees'
              },
              {
                icon: '📱',
                title: 'Digital Process',
                description: 'Apply and track online, anytime'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Corporate Partnership With
            </h3>
            <p className="text-gray-600">Trusted by leading financial institutions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="bg-white h-20 rounded-xl flex items-center justify-center p-4 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-gray-400 text-xl font-bold">
                  Partner {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoanSection