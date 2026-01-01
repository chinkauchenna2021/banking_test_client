'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MailIcon } from 'lucide-react'

// FAQ Item Component
interface FAQItemProps {
  question: string
  answer: string
  isActive: boolean
  onClick: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isActive, onClick }) => {
  return (
    <li className="accordion block">
      <div className={`acc-btn ${isActive ? 'active' : ''}`} onClick={onClick}>
        <div className="icon-outer">
          <i className="icon-right-arrow"></i>
        </div>
        <h3>{question}</h3>
      </div>
      <div className={`acc-content ${isActive ? 'current' : ''}`}>
        <p>{answer}</p>
      </div>
    </li>
  )
}

// Breadcrumb Component
const Breadcrumb: React.FC = () => {
  return (
    <section className="breadcrumb-area">
      <div 
        className="breadcrumb-area-bg"
        style={{ backgroundImage: 'url(/assets/images/backgrounds/breadcrumb-area-bg.jpg)' }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="inner-content">
              <div 
                className="title" 
                data-aos="fade-right" 
                data-aos-easing="linear" 
                data-aos-duration="500"
              >
                <h2>FAQ's</h2>
              </div>
              <div 
                className="breadcrumb-menu" 
                data-aos="fade-left" 
                data-aos-easing="linear" 
                data-aos-duration="500"
              >
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li className="">FAQ's</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// FAQ Search Component
const FAQSearch: React.FC = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Search submitted')
  }

  return (
    <div className="faq-search-box">
      <div className="faq-search-box__inner">
        <form className="search-form" onSubmit={handleSearch}>
          <input type="text" placeholder="Related Keyword..." />
          <button type="submit">
            <i className="icon-search"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

// FAQ Category Data
const faqCategories = {
  general: [
    {
      id: 1,
      question: "Is there a minimum balance requirement?",
      answer: "Our checking account has no minimum balance requirement and no monthly maintenance fees. For savings accounts, the minimum opening deposit is $100, with no ongoing minimum balance required."
    },
    {
      id: 2,
      question: "When will I receive my monthly account statement?",
      answer: "Digital statements are available on the 1st of each month in your online banking portal. Paper statements are mailed within 3 business days. You can also access real-time statements anytime through our mobile app."
    },
    {
      id: 3,
      question: "How can I reset my online banking password?",
      answer: "You can reset your password through our mobile app's 'Forgot Password' feature or visit our website's login page. Alternatively, call our 24/7 customer support at 1-800-FINFLOW for immediate assistance."
    },
    {
      id: 4,
      question: "How secure is your online banking platform?",
      answer: "We use 256-bit SSL encryption, multi-factor authentication, and biometric login options. All transactions are monitored 24/7 by our fraud detection system, and your deposits are FDIC insured up to $250,000."
    }
  ],
  accounts: [
    {
      id: 5,
      question: "What documents do I need to open an account?",
      answer: "You'll need a valid government-issued photo ID (driver's license, passport, or state ID), Social Security number, and proof of address (utility bill or lease agreement). The entire process can be completed online in under 10 minutes."
    },
    {
      id: 6,
      question: "Are there fees for international transactions?",
      answer: "We charge 1% for international debit card transactions and 3% for credit card cash advances abroad. International wire transfers cost $15 outgoing and $10 incoming. All foreign transactions include real exchange rates with no hidden fees."
    },
    {
      id: 7,
      question: "How do I order checks or a new debit card?",
      answer: "Order checks through your online banking dashboard under 'Account Services.' New debit cards can be ordered in the app and will arrive within 5-7 business days. Lost cards can be instantly frozen and replaced overnight for $15."
    },
    {
      id: 8,
      question: "What interest rates do you offer on savings?",
      answer: "Our high-yield savings account offers 4.25% APY, while our money market account offers 4.50% APY. Certificate of Deposit rates range from 4.75% to 5.25% depending on term length. All rates are significantly above the national average."
    },
    {
      id: 9,
      question: "Can I set up automatic bill payments?",
      answer: "Yes, our bill pay service allows you to schedule recurring payments for utilities, loans, and subscriptions. You can set up payments to be deducted from checking or savings accounts, with email reminders 3 days before each payment."
    }
  ]
}

export default function FAQPage() {
  const [activeFAQ, setActiveFAQ] = useState<number>(1)

  const handleFAQClick = (id: number) => {
    setActiveFAQ(activeFAQ === id ? 0 : id)
  }

  useEffect(() => {
    // Initialize AOS (Animate On Scroll)
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init({
        duration: 1000,
        once: true,
      })
    }

    // Initialize any other scripts that need to run
    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <div className="faq-page">
        
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* FAQ Main Content */}
        <section className="faq-page-one">
          <div className="container">
            <div className="sec-title text-center">
              <h2>Frequently Asked Questions</h2>
              <div className="sub-title">
                <p>Find answers to all your queries about our service.</p>
              </div>
            </div>

            {/* Search Box */}
            <FAQSearch />

            <div className="row">
              {/* Left Column - General FAQs */}
              <div className="col-xl-6">
                <div className="faq-style1__content">
                  <h3 className="faq-category-title">General Questions</h3>
                  <ul className="accordion-box">
                    {faqCategories.general.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isActive={activeFAQ === faq.id}
                        onClick={() => handleFAQClick(faq.id)}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Account FAQs */}
              <div className="col-xl-6">
                <div className="faq-style1__content margintop">
                  <h3 className="faq-category-title">Account Related</h3>
                  <ul className="accordion-box">
                    {faqCategories.accounts.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isActive={activeFAQ === faq.id}
                        onClick={() => handleFAQClick(faq.id)}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          {/* Additional FAQ Sections */}
          <div className="row">
            <div className="col-xl-12">
              <div className="faq-additional-info mt-20 pt-15 border-t border-gray-200">
                <div className="row">
                  <div className="col-xl-6">
                    <div className="faq-contact-box p-10 flex items-center gap-6 min-h-[220px]">
                      <div className="icon min-w-[70px] h-[70px] flex items-center justify-center flex-shrink-0">
                        <i className="icon-phone text-3xl"></i>
                      </div>
                      <div className="content">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
                        <p className="text-gray-600 mb-5 leading-relaxed">
                          Can't find the answer you're looking for? Please chat with our friendly team.
                        </p>
                        <a 
                          href="tel:80012345678" 
                          className="contact-phone inline-flex items-center gap-3 text-blue-600 font-semibold text-lg"
                        >
                          <i className="fas fa-phone-alt text-base"></i>
                          (800) 123 456 78
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="faq-email-box p-10 flex items-center gap-6 min-h-[220px]">
                      <div className="icon min-w-[70px] h-[70px] flex items-center justify-center flex-shrink-0">
                        <MailIcon className="icon-email text-3xl"></MailIcon>
                      </div>
                      <div className="content">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Us</h3>
                        <p className="text-gray-600 mb-5 leading-relaxed">
                          Send us an email and we'll get back to you as soon as possible.
                        </p>
                        <a 
                          href="mailto:support@finbank.com" 
                          className="contact-email inline-flex items-center gap-3 text-blue-600 font-semibold text-lg"
                        >
                          <i className="far fa-envelope text-base"></i>
                          support@finbank.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

    </div>
  )
}
