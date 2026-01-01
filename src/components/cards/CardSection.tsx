// app/components/cards/CardsSection.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Card {
  category: string
  name: string
  image: string
  description: string
  features: string[]
  checked: boolean
}

const CardsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cards, setCards] = useState<Card[]>([
    {
      category: 'Rewards',
      name: 'Platinum Credit Card',
      image: 'card-1.jpg',
      description: 'Explore a new world of rewards with the Platinum Credit Card.',
      features: [
        'Zero Joining and Annual Fees',
        '2% Fuel Surcharge waiver at HPCL Petrol Pumps',
        'Multi Rewards & Lifestyle Benefits',
        '5X TAT Miles on Travel'
      ],
      checked: true
    },
    {
      category: 'Cashback',
      name: 'Millinnia Credit Card',
      image: 'card-2.jpg',
      description: 'Righteous indignation and dislike men who are so beguiled and demoralized.',
      features: [
        'Welcome vouchers worth Rs. 2000+',
        '1% Fuel Surcharge waiver at HPCL Petrol Pumps',
        'Lifestyle Benefits',
        'Access to 1000+ global airport lounges'
      ],
      checked: false
    },
    {
      category: 'Rewards',
      name: 'Money Back Credit Card',
      image: 'card-3.jpg',
      description: 'Explore a new world of rewards with the Platinum Credit Card.',
      features: [
        'Zero Joining and Annual Fees',
        '2% Fuel Surcharge waiver at HPCL Petrol Pumps',
        'Multi Rewards & Lifestyle Benefits',
        '5X TAT Miles on Travel'
      ],
      checked: false
    },
    {
      category: 'Cashback',
      name: 'Easy EMI Credit Card',
      image: 'card-4.jpg',
      description: 'Righteous indignation and dislike men who are so beguiled and demoralized.',
      features: [
        'Welcome vouchers worth Rs. 2000+',
        '1% Fuel Surcharge waiver at HPCL Petrol Pumps',
        'Lifestyle Benefits',
        'Access to 1000+ global airport lounges'
      ],
      checked: false
    },
    {
      category: 'Rewards',
      name: 'Diners Club Privilege Card',
      image: 'card-5.jpg',
      description: 'Explore a new world of rewards with the Platinum Credit Card.',
      features: [
        'Zero Joining and Annual Fees',
        '2% Fuel Surcharge waiver at HPCL Petrol Pumps',
        'Multi Rewards & Lifestyle Benefits',
        '5X TAT Miles on Travel'
      ],
      checked: false
    }
  ])

  const cardTypes = [
    { name: 'Business', link: '/cards-business' },
    { name: 'Cashback', link: '/cards-cashback' },
    { name: 'Low Interest', link: '/cards-law-interest' },
    { name: 'Rewards', link: '/cards-rewards' },
    { name: 'Secured', link: '/cards-secured' },
    { name: 'Travel & Hotel', link: '/cards-travel-hotel' }
  ]

  const toggleCardCheck = (index: number) => {
    setCards(cards.map((card, i) => 
      i === index ? { ...card, checked: !card.checked } : card
    ))
  }

  const filteredCards = selectedCategory === 'all' 
    ? cards 
    : cards.filter(card => card.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <>
      {/* Breadcrumb Area */}
      <section className="breadcrumb-area">
        <div 
          className="breadcrumb-area-bg"
          style={{ backgroundImage: "url(/assets/images/backgrounds/breadcrumb-area-bg-5.jpg)" }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="inner-content">
                <div className="title" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">
                  <h2>Our Cards</h2>
                </div>
                <div className="breadcrumb-menu" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500">
                  <ul>
                    <li><Link href="/">Home</Link></li>
                    <li className="active">Our Cards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Banner Area */}
      <section className="card-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="card-banner-content">
                <div 
                  className="card-banner-content-bg"
                  style={{ backgroundImage: "url(/assets/images/shapes/card-banner-area-bg.png)" }}
                ></div>
                <div className="card-banner-content-img-box">
                  <img src="/assets/images/resources/card-banner-img-1.png" alt="Credit Card" />
                </div>
                <div className="inner-title">
                  <h4>Corporate Credit Card</h4>
                  <h2>Higher Efficiencies &<br /> Savings</h2>
                </div>
                <div className="text">
                  <p>Rationally encounter consequences that are <br /> who loves or pursues desire.</p>
                </div>
                <div className="btns-box">
                  <a className="btn-one" href="/loan-home">
                    <span className="txt">Apply Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Area */}
      <section className="cards-area">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3">
              <div className="sidebar-box-style1">
                <div className="single-sidebar-box-style1 margintop">
                  <div className="sidebar-title">
                    <div className="dot-box"></div>
                    <h3>Card Types</h3>
                  </div>
                  <div className="card-types-box">
                    <ul>
                      {cardTypes.map((type, index) => (
                        <li key={index}>
                          <Link href={type.link}>{type.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-9">
              <div className="cards-content-box">
                <div className="cards-content-box-top">
                  <div className="left-box">
                    <h2>Best Cards for Your Needs</h2>
                  </div>
                  <div className="right-box">
                    <div className="short-by">
                      <div className="select-box">
                        <select className="wide">
                          <option data-display="Default Sorting">Default Sorting</option>
                          <option value="1">Popularity</option>
                          <option value="2">Popularity</option>
                          <option value="3">Popularity</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards List */}
                {filteredCards.map((card, index) => (
                  <div key={index} className="single-card-box">
                    <div className="category-box">{card.category}</div>
                    <div className="cards-img-box">
                      <div className="inner-title">
                        <h3>{card.name}</h3>
                      </div>
                      <div className="inner">
                        <img 
                          src={`/assets/images/resources/${card.image}`} 
                          alt={card.name} 
                        />
                      </div>
                      <div className="btn-box">
                        <a className="btn-one style2" href="/contact">
                          <span className="txt">Apply Now</span>
                        </a>
                        <a className="btn-one" href="#">
                          <span className="txt">Read More</span>
                        </a>
                      </div>
                    </div>
                    <div className="cards-text-box">
                      <p>{card.description}</p>
                      <h3>Features & Benefits</h3>
                      <ul>
                        {card.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                      <div className="compare-box">
                        <div className="checked-box1">
                          <input 
                            type="checkbox" 
                            name={`card-${index}`} 
                            id={`card-${index}`} 
                            checked={card.checked}
                            onChange={() => toggleCardCheck(index)}
                          />
                          <label htmlFor={`card-${index}`}>
                            <span></span>Add to Compare
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CardsSection