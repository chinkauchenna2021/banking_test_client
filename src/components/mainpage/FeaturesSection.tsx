// app/components/FeaturesSection.tsx
'use client'

export default function FeaturesSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted')
  }

  return (
    <section className="features-style3-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="features-style3-img-box features-style3-img-box--style2">
              <div
                className="inner-img-bg"
                style={{ backgroundImage: 'url(/assets/images/resources/features-style3-img-2.png)' }}
              ></div>
              <div className="overaly-text">
                <div className="review-box">
                  <ul>
                    {[...Array(5)].map((_, i) => (
                      <li key={i}><i className="fa fa-star"></i></li>
                    ))}
                  </ul>
                </div>
                <h3><span>4.2K+</span> Active Card<br /> Holders</h3>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="features-style3-content">
              <div className="sec-title">
                <h2>Personalize Your<br /> Card and Stand Out<br /> From Crowd</h2>
                <div className="sub-title">
                  <p>Desire that they cannot foresee the pain & trouble that are bound too ensue equal blame belongs through shrinking.</p>
                </div>
              </div>
              <div className="text-box">
                <ul>
                  <li>
                    <div className="icon">
                      <span className="icon-checkbox-mark"></span>
                    </div>
                    <p>Great explorer of the master-builder</p>
                  </li>
                  <li>
                    <div className="icon">
                      <span className="icon-checkbox-mark"></span>
                    </div>
                    <p>Great explorer of the master-builder</p>
                  </li>
                </ul>
                <div className="apply-credit-card">
                  <h3>Apply for Credit Card</h3>
                  <form id="apply-credit-card" onSubmit={handleSubmit}>
                    <div className="input-box">
                      <input
                        type="email"
                        name="form_email"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                    <div className="button-box">
                      <button className="btn-one" type="submit">
                        <span className="txt">Apply Now</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}