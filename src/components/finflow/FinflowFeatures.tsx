'use client'

import { useState } from 'react'
import { tabs } from '@/app/data/bankingData'

export default function FinflowFeatures() {
  const [activeTab, setActiveTab] = useState<string>('income')

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <section className="finflow-features-area" id="features">
      <div className="container">
        <div className="finflow-section-header">
          <h2 className="section-title">Super convenient online banking</h2>
          <p className="section-description">
            You can view your account balances, transaction history, and statements, 
            and even set up custom alerts to help you stay on top of your finances.
          </p>
        </div>
        
        <div className="finflow-features-tabs">
          <div className="features-tabs-content">
            <div className="row">
              <div className="col-xl-6">
                <div className="features-image-wrapper">
                  {activeTabData && (
                    <img 
                      src={activeTabData.image} 
                      alt={activeTabData.title}
                      className="feature-image"
                    />
                  )}
                </div>
              </div>
              <div className="col-xl-6">
                <div className="features-content-wrapper">
                  <h3>{activeTabData?.mainTitle}</h3>
                  <p className="feature-description">{activeTabData?.description}</p>
                  <ul className="features-list">
                    {activeTabData?.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="features-tabs-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon">
                  <i className={tab.icon}></i>
                </div>
                <div className="tab-content">
                  <h4>{tab.title}</h4>
                  <p>{tab.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}