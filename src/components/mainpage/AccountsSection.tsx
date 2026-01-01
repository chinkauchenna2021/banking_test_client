import { accounts } from '@/app/data/bankingData'

export default function AccountsSection() {
  return (
    <section className="account-style1-area finflow-accounts">
      <div className="container">
        <div className="sec-title text-center">
          <h2>Why Choose Finflow Banking?</h2>
          <div className="sub-title">
            <p>The only fintech app you'll ever need.</p>
          </div>
        </div>
        <div className="row">
          {accounts.map((account) => (
            <div key={account.id} className="col-xl-4 col-lg-4">
              <div className="single-account-box-style1 finflow-account-card">
                <div className="img-holder">
                  <img src={account.image} alt={account.title} />
                  <div className="account-overlay">
                    <a href={account.link} className="account-link">
                      <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
                <div className="text-holder">
                  <h3><a href={account.link}>{account.title}</a></h3>
                  <p>{account.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="account-style1-area_btn">
              <a href="/accounts">
                <span className="icon-right-arrow"></span>View All Banking Solutions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}