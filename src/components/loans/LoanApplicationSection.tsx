// app/components/loans/LoanApplicationSection.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ApplicationStep {
  number: string
  title: string
  description: string
}

interface PartnerLogo {
  image: string
  alt: string
}

const LoanApplicationSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    date: ''
  })

  const applicationSteps: ApplicationStep[] = [
    {
      number: '01',
      title: 'Apply Here',
      description: 'Perfectly simple & easy to distinguish of choice is prevents.'
    },
    {
      number: '02',
      title: 'Get Call Back',
      description: 'Claims off duty or the obligations it will pleasures be repudiated.'
    },
    {
      number: '03',
      title: 'Process Your Request',
      description: 'Demoralized by charms pleasure of the they cannot and trouble.'
    }
  ]

  const partnerLogos: PartnerLogo[] = [
    { image: 'brand-1-1.png', alt: 'Partner 1' },
    { image: 'brand-1-2.png', alt: 'Partner 2' },
    { image: 'brand-1-3.png', alt: 'Partner 3' },
    { image: 'brand-1-4.png', alt: 'Partner 4' },
    { image: 'brand-1-5.png', alt: 'Partner 5' },
    { image: 'brand-1-6.png', alt: 'Partner 6' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <>
      {/* Breadcrumb Area */}
      <section className="breadcrumb-area">
        <div 
          className="breadcrumb-area-bg"
          style={{ backgroundImage: "url(/assets/images/backgrounds/breadcrumb-area-bg-4.jpg)" }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="inner-content">
                <div className="title" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">
                  <h2>Education Loan</h2>
                </div>
                <div className="breadcrumb-menu" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500">
                  <ul>
                    <li><Link href="/">Home</Link></li>
                    <li className="active">Education Loan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applying Process Area */}
      <section className="applying-process-area">
        <div className="container">
          <div className="sec-title text-center">
            <h2>Explore and Apply Now</h2>
            <div className="sub-title">
              <p>Customised solutions for all your banking needs.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="applying-process-step-box-top"></div>
            </div>
            {applicationSteps.map((step, index) => (
              <div key={index} className="col-xl-4 col-lg-4">
                <div className="single-applying-process-box">
                  <div className="applying-process-single-step-box">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Form Area */}
      <section className="apply-form-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="apply-form-box clearfix">
                <div 
                  className="apply-form-box-bg"
                  style={{ backgroundImage: "url(/assets/images/resources/apply-form-box-bg.jpg)" }}
                ></div>
                <div className="apply-form-box__content">
                  <div className="sec-title">
                    <h2>Send Your Request &<br /> Get Call Back</h2>
                    <div className="sub-title">
                      <p>Fill all the necessary details and Get call from experts.</p>
                    </div>
                  </div>

                  <form id="apply-form" className="default-form2" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="input-box">
                            <input 
                              type="text" 
                              name="name" 
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your Name" 
                              required 
                            />
                            <div className="icon">
                              <i className="fas fa-user"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="input-box">
                            <input 
                              type="email" 
                              name="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Email" 
                              required 
                            />
                            <div className="icon">
                              <i className="fas fa-envelope-open"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="input-box">
                            <input 
                              type="text" 
                              name="phone" 
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Phone" 
                            />
                            <div className="icon">
                              <i className="fas fa-phone-alt"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="select-box clearfix">
                            <select 
                              className="wide" 
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                            >
                              <option data-display="State">State</option>
                              <option value="1">Alaska</option>
                              <option value="2">Florida</option>
                              <option value="3">Georgia</option>
                              <option value="4">Indiana</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="select-box clearfix">
                            <select 
                              className="wide" 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                            >
                              <option data-display="City">City</option>
                              <option value="1">New York</option>
                              <option value="2">Los Angeles</option>
                              <option value="3">Chicago</option>
                              <option value="4">Houston</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group">
                          <div className="input-box">
                            <input 
                              type="text" 
                              name="date" 
                              value={formData.date}
                              onChange={handleInputChange}
                              placeholder="Date" 
                            />
                            <div className="icon">
                              <i className="fas fa-calendar"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <div className="button-box">
                          <button className="btn-one" type="submit">
                            <span className="txt">Send Request</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Area */}
      <section className="partner-area">
        <div className="container">
          <div className="partner-area__sec-title">
            <h3>Corporate Partnership With</h3>
          </div>
          <div className="brand-content">
            <div className="owl-carousel owl-theme thm-owl__carousel partner-carousel">
              {partnerLogos.map((logo, index) => (
                <div key={index} className="single-partner-logo-box">
                  <a href="#">
                    <img 
                      src={`/assets/images/brand/${logo.image}`} 
                      alt={logo.alt} 
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LoanApplicationSection