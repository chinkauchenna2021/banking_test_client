// app/components/accounts/SavingsAccountSection.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface OverviewItem {
  icon: string
  title: string
}

interface BenefitItem {
  icon: string
  title: string
  description: string
}

interface EligibilityItem {
  number: string
  title: string
  description: string
}

interface DocumentItem {
  title: string
  items?: string[]
}

interface InterestRate {
  balance: string
  interest: string
}

const SavingsAccountSection = () => {
  const [activeSection, setActiveSection] = useState('benefits')

  const overviewItems: OverviewItem[] = [
    {
      icon: "icon-checkbox-mark",
      title: "Instant Account<br> Opening"
    },
    {
      icon: "icon-checkbox-mark",
      title: "Exciting Offers &<br> Discounts"
    },
    {
      icon: "icon-checkbox-mark",
      title: "Secure Internet &<br> Mob Banking"
    },
    {
      icon: "icon-checkbox-mark",
      title: "Earn<br> Reward Points"
    }
  ]

  const benefitItems: BenefitItem[] = [
    {
      icon: "icon-high",
      title: "Earn Interest up to 7%",
      description: "Holds these matters principles selection right some rejects."
    },
    {
      icon: "icon-notification",
      title: "Free SMS Alerts",
      description: "Business will frequently occur that pleasure have to be repudiated."
    },
    {
      icon: "icon-safebox",
      title: "Discounts on Locker",
      description: "The wise man therefore always holds these principle of selection."
    },
    {
      icon: "icon-credit-card-2",
      title: "International Debit Cards",
      description: "The wise man therefore always holds these principle of selection."
    },
    {
      icon: "icon-shield-1",
      title: "Provides Safety",
      description: "Holds these matters principles selection right some rejects."
    },
    {
      icon: "icon-paperless",
      title: "Paperless Banking",
      description: "Business will frequently occur that pleasure have to be repudiated."
    }
  ]

  const eligibilityItems: EligibilityItem[] = [
    {
      number: "1",
      title: "Nationality",
      description: "Indian Residents, and Non-Resident individuals"
    },
    {
      number: "2",
      title: "Age",
      description: "18 Years old or above"
    },
    {
      number: "3",
      title: "Nationality",
      description: "Residents, and Non-Resident individuals"
    },
    {
      number: "4",
      title: "Age",
      description: "18 Years old or above"
    }
  ]

  const documentItems: DocumentItem[] = [
    {
      title: "PAN Card<br> is Mandatory"
    },
    {
      title: "Duly Filled<br> Application Form"
    },
    {
      title: "Non Resident",
      items: ["Passport", "Driving License", "Aadhaar Number", "Voter's Identity Card"]
    },
    {
      title: "For Resident",
      items: ["Passport", "Visa", "Bank Statement (If any)", "Company Proof"]
    },
    {
      title: "Color & Passport Size<br>Photographs"
    },
    {
      title: "Color & Passport Size<br>Photographs"
    }
  ]

  const interestRates: InterestRate[] = [
    { balance: "Up to Rs. 1 Lakh", interest: "3.00%" },
    { balance: "Above 1 Lakh to 5 Lakh", interest: "5.00%" },
    { balance: "Above 5 Lakh to 10 Lakh", interest: "8.25%" },
    { balance: "Above 10Lakh", interest: "10.00%" }
  ]

  const faqItems = [
    {
      question: "What is the minimum balance?",
      answer: "Rationally encounter consequences that are extremely painful again there anyone who loves or pursues desire."
    },
    {
      question: "What is the rate of interest?",
      answer: "Rationally encounter consequences that are extremely painful again there anyone who loves or pursues desire."
    },
    {
      question: "When will I receive my account statement?",
      answer: "Rationally encounter consequences that are extremely painful again there anyone who loves or pursues desire."
    },
    {
      question: "Can I use any branch across India?",
      answer: "Rationally encounter consequences that are extremely painful again there anyone who loves or pursues desire."
    },
    {
      question: "How safe/secure is our net banking a/c?",
      answer: "Rationally encounter consequences that are extremely painful again there anyone who loves or pursues desire."
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['benefits', 'eligibility', 'required', 'interest']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Breadcrumb Area */}
      <section className="breadcrumb-area">
        <div 
          className="breadcrumb-area-bg"
          style={{ backgroundImage: "url(/assets/images/backgrounds/breadcrumb-area-bg-3.jpg)" }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="inner-content">
                <div className="title" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">
                  <h2>Savings Account</h2>
                </div>
                <div className="breadcrumb-menu" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500">
                  <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/accounts">Accounts</Link></li>
                    <li className="active">Savings Account</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Area */}
      <section className="overview-area">
        <div className="container">
          <div className="sec-title text-center">
            <h2>Get More From Your Money</h2>
            <div className="sub-title">
              <p>Access your money anytime and anywhere.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6">
              <div className="overview-content-box-one">
                <ul className="clearfix">
                  {overviewItems.map((item, index) => (
                    <li key={index}>
                      <div className="single-overview-box">
                        <div className="icon">
                          <span className={item.icon}></span>
                        </div>
                        <div className="title">
                          <h3><a href="#">{item.title}</a></h3>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="overview-content-box-two">
                <div className="inner-title">
                  <h5>Know About</h5>
                  <h2>Savings Account</h2>
                </div>
                <div className="text">
                  <p>Fail in their duty through weakness of will which is the same as saying through shrinking from toil and pain cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice.</p>
                  <p>The claims off duty or the obligations business it will frequently occur that pleasures be repudiated to distinguish nothing prevents.</p>
                </div>
                <div className="btns-box">
                  <a className="btn-one" href="/blog">
                    <span className="txt"><i className="icon-payment"></i>Open an Account</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Area */}
      <section className="statistics-style2-area">
        <div className="statistics-style2-area-shape1">
          <img src="/assets/images/shapes/statistics-style2-area-shape-1.png" alt="" />
        </div>
        <div 
          className="statistics-style2-area-bg"
          style={{ backgroundImage: "url(/assets/images/backgrounds/statistics-style2-area-bg.jpg)" }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-8">
              <div className="statistics-content-box-style2">
                <div className="sec-title">
                  <h2>Reach Your<br /> Savings Goal With Us</h2>
                </div>
                <div className="progress-block">
                  <div className="inner-box">
                    <div className="graph-outer">
                      <input 
                        type="text" 
                        className="dial" 
                        // dataFgColor="#cf173c" 
                        // dataBgColor="#f7f1eb"
                        // dataWidth="140" 
                        // dataHeight="140" 
                        // dataLinecap="normal" 
                        value="84"
                      />
                      <div className="outer-text">
                        <h3>Year of<br /> 2021</h3>
                      </div>
                    </div>
                  </div>
                  <div className="inner-text count-box">
                    <div className="count-text-outer">
                      <span className="count-text" data-stop="84" data-speed="2000"></span>%
                    </div>
                    <h3>Income Statement</h3>
                    <p>Long established fact that a reader will distracted</p>
                    <div className="btn-box">
                      <a href="#"><span className="icon-right-arrow"></span>Download</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Contains Area */}
      <section className="page-contains-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="page-contains-box">
                <div className="page-contains-btn">
                  <ul className="navigation clearfix scroll-nav">
                    <li className={activeSection === 'benefits' ? 'current' : ''}>
                      <a href="#benefits">
                        <span className="icon-right-arrow"></span>
                        Benefits
                      </a>
                    </li>
                    <li className={activeSection === 'eligibility' ? 'current' : ''}>
                      <a href="#eligibility">
                        <span className="icon-right-arrow"></span>
                        Eligibility
                      </a>
                    </li>
                    <li className={activeSection === 'required' ? 'current' : ''}>
                      <a href="#required">
                        <span className="icon-right-arrow"></span>
                        Documents Required
                      </a>
                    </li>
                    <li className={activeSection === 'interest' ? 'current' : ''}>
                      <a href="#interest">
                        <span className="icon-right-arrow"></span>
                        Interest & Charges
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="right-btn">
                  <a href="/faq">Customers faq's</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Area */}
      <section id="benefits" className="benefits-style2-area">
        <div className="container">
          <div className="sec-title text-center">
            <h2>Our Savings Account Benefits</h2>
            <div className="sub-title">
              <p>We help businesses and customers achieve more.</p>
            </div>
          </div>
          <ul className="row benefits-content text-center">
            {benefitItems.map((benefit, index) => (
              <li key={index} className="col-xl-4 single-benefits-box-colum">
                <div className="single-benefits-box">
                  <div className="icon">
                    <span className={benefit.icon}></span>
                  </div>
                  <div className="text">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Eligibility Area */}
      <section id="eligibility" className="eligibility-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="eligibility-img-box">
                <div className="sec-title">
                  <h2>Eligibility to <br />Open Savings Account</h2>
                  <div className="sub-title">
                    <p>Eligibility parameters for saving account.</p>
                  </div>
                </div>
                <div className="eligibility-img-box__inner">
                  <img src="/assets/images/resources/eligibility-img-1.jpg" alt="Eligibility" />
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="eligibility-content-box">
                <div className="eligibility-content-box__inner">
                  <ul>
                    {eligibilityItems.map((item, index) => (
                      <li key={index}>
                        <div className="inner">
                          <div className="counting">{item.number}</div>
                          <div className="text">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="facts-box-style2">
                  <div className="counting">
                    <h2 className="odometer" data-count="2.3">2.3</h2>
                    <span className="k">k</span>
                  </div>
                  <div className="inner-title">
                    <h3>Saving account opened<br /> in last year</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Area */}
      <section id="required" className="documents-area">
        <div className="container">
          <div className="sec-title text-center">
            <h2>Savings A/c Required Documents</h2>
            <div className="sub-title">
              <p>Basic documents required for opening a savings account.</p>
            </div>
          </div>
          <div className="row">
            {documentItems.map((doc, index) => (
              <div key={index} className="col-xl-3 col-lg-6">
                <div className="single-documents-box">
                  <div className="inner-title">
                    <h3 dangerouslySetInnerHTML={{ __html: doc.title }} />
                  </div>
                  {doc.items && (
                    <ul>
                      {doc.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="icon-play-button-1"></span>
                          <a href="#">{item}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interest & Charges Area */}
      <section id="interest" className="interest-charges-area">
        <div className="interest-charges-area-shape1">
          <img src="/assets/images/shapes/interest-charges-area-shape-1.png" alt="" />
        </div>
        <div className="container">
          <div className="sec-title text-center">
            <h2>Account Interest & Charges</h2>
            <div className="sub-title">
              <p>Your money is making money for you & Your Family.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="interest-charges-table-box">
                <div className="table-outer">
                  <table className="interest-charges-table">
                    <tbody>
                      <tr>
                        <td className="title">
                          <h3>Account Interest Rates<br /> Per Annum</h3>
                        </td>
                        <td className="balance">
                          <div className="inner-title">
                            <h3>Balance in a/c</h3>
                          </div>
                          <ul>
                            {interestRates.map((rate, idx) => (
                              <li key={idx}>{rate.balance}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="interest">
                          <div className="inner-title">
                            <h3>Interest</h3>
                          </div>
                          <ul>
                            {interestRates.map((rate, idx) => (
                              <li key={idx}>{rate.interest}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="title">
                          <h3>Debit Card</h3>
                        </td>
                        <td className="balance">
                          <ul>
                            <li>Annual Fees</li>
                            <li>Transaction Limit</li>
                            <li>Card Replacement</li>
                          </ul>
                        </td>
                        <td className="interest">
                          <ul>
                            <li>Nill</li>
                            <li>20 Lakh / Annum</li>
                            <li>Rs.600+Taxes</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="title">
                          <h3>Credit Card</h3>
                        </td>
                        <td className="balance">
                          <ul>
                            <li>Annual Fees</li>
                            <li>Card Replacement</li>
                          </ul>
                        </td>
                        <td className="interest">
                          <ul>
                            <li>Rs.1500</li>
                            <li>Rs.600+Taxes</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Area */}
      <section className="faq-style1-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="faq-style1-title">
                <div className="sec-title">
                  <h2>Questions & Answers</h2>
                  <div className="sub-title">
                    <p>Find answers to all your queries about our service.</p>
                  </div>
                </div>
                <div className="faq-search-box">
                  <h3>Help You to Find</h3>
                  <div className="faq-search-box__inner">
                    <form className="search-form" action="#">
                      <input placeholder="Related Keyword..." type="text" />
                      <button type="submit">
                        <i className="icon-search"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <div className="faq-style1__image">
                <div className="inner">
                  <img src="/assets/images/resources/faq-style1__image.jpg" alt="FAQ" />
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="faq-style1__content">
                <ul className="accordion-box">
                  {faqItems.map((faq, index) => (
                    <li key={index} className="accordion block">
                      <div className="acc-btn">
                        <div className="icon-outer"><i className="icon-right-arrow"></i></div>
                        <h3>{faq.question}</h3>
                      </div>
                      <div className="acc-content">
                        <p>{faq.answer}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="faq-style1-bottom-box text-center">
                <p>Didn't get, Click below button to more answers or <a href="#">contact us.</a></p>
                <div className="btns-box">
                  <a className="btn-one" href="#">
                    <span className="txt">Grab Your Deals</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SavingsAccountSection