export default function FinflowOverview() {
  const services = [
    {
      id: 1,
      icon: 'far fa-money-bill-alt',
      title: 'Digital Checking Account',
      description: 'Enjoy no monthly fees, unlimited transactions, and instant mobile check deposit with our fully digital checking account.'
    },
    { 
      id: 2,
      icon: 'far fa-building',
      title: 'High-Yield Savings',
      description: 'Earn up to 5.25% APY with automated savings tools and no withdrawal limits on your high-yield savings account.'
    },
    {
      id: 3,
      icon: 'far fa-handshake',
      title: 'Smart Loan Options',
      description: 'Get personalized loan rates with instant approval for personal, auto, and home improvement loans starting at 4.99% APR.'
    },
    {
      id: 4,
      icon: 'far fa-credit-card',
      title: 'Rewards Credit Cards',
      description: 'Earn up to 3% cash back on every purchase with our flexible credit cards featuring contactless payment technology.'
    }
  ]

  return (
    <section className="finflow-overview-area" id="overview">
      <div className="container">
        <div className="finflow-section-header">
          <h5 className="section-subtitle">Why Choose Finflow?</h5>
          <h2 className="section-title">Your Complete Digital Banking Solution</h2>
          <p className="section-description">
            Manage all your financial needs in one secure platform with 24/7 access and real-time insights.
          </p>
        </div>
        
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-12 ">
              <div className="finflow-service-card !rounded-none">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {/* <a href="#" className="service-learn-more !mt-14">
                    Learn more <i className="fas fa-arrow-right"></i>
                  </a> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="finflow-stats-row">
          <div className="stat-item">
            <div className="stat-number">1.8M+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$45B+</div>
            <div className="stat-label">Assets Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Customer Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime Guarantee</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}