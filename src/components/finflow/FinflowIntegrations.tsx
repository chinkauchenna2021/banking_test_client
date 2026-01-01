import { walletIntegrations } from '@/app/data/bankingData'

export default function FinflowIntegrations() {
  return (
    <section className="finflow-integrations-area" id="integrations">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="integrations-content">
              <div className="content-header">
                <div className="header-icon">
                  <i className="far fa-money-bill-alt"></i>
                </div>
                <h2>Wallet Integrations</h2>
              </div>
              <p>
                Whether you're at home, at work, or on the go, our online banking 
                platform is accessible from your computer, tablet, or mobile device. 
                With our mobile banking app, you can even deposit checks and manage 
                your accounts on the go.
              </p>
              <a href="#" className="learn-more-btn">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="integrations-grid">
              <div className="row">
                {walletIntegrations.map((wallet) => (
                  <div key={wallet.id} className="col-xl-6 col-lg-6 col-md-6 mb-4">
                    <div className="wallet-card">
                      <div className="wallet-icon">
                        <img src={wallet.icon} alt={wallet.name} />
                      </div>
                      <div className="wallet-description">
                        <p>{wallet.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}