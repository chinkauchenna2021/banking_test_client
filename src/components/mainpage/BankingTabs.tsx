'use client'

import { useState } from 'react'
import { tabs } from '@/app/data/bankingData'

export default function BankingTabs() {
  const [activeTab, setActiveTab] = useState<string>('income')

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <section className="banking-tab-area finflow-banking-tabs">
      <div className="auto-container">
        <div className="banking-tab">
          <div className="section-header">
            <h2>Advanced Banking Features</h2>
            <p>Everything you need for modern financial management</p>
          </div>

          <div className="tabs-content-box">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-content-box-item ${activeTab === tab.id ? 'tab-content-box-item-active' : ''}`}
                id={tab.id}
                style={{ display: activeTab === tab.id ? 'block' : 'none' }}
              >
                <div className="banking-tab-content-item">
                  <div className="row align-items-center">
                    <div className="col-xl-6">
                      <div className="banking-tab-img-box">
                        <div className="feature-badge">
                          <span>{tab.subtitle}</span>
                        </div>
                        <img 
                          src={tab.image} 
                          alt={tab.title}
                          className="feature-image"
                        />
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="banking-tab-text-box">
                        <div className="inner-title">
                          <h3>{tab.mainTitle}</h3>
                          <h2 dangerouslySetInnerHTML={{ __html: tab.mainSubtitle }} />
                        </div>
                        <div className="banking-tab-text-box__inner">
                          <div className="text">
                            <p>{tab.description}</p>
                          </div>
                          <ul className="feature-list">
                            {tab.features.map((feature, index) => (
                              <li key={index}>
                                <i className="fas fa-check"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <a href="#" className="feature-link">
                            Explore Feature <i className="fas fa-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="banking-tab__button">
            <ul className="tabs-button-box clearfix">
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={`tab-btn-item ${activeTab === tab.id ? 'active-btn-item' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="inner">
                    <div className="icon">
                      <i className={tab.icon}></i>
                    </div>
                    <div className="title">
                      <h4>{tab.subtitle}</h4>
                      <h3>{tab.title}</h3>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}