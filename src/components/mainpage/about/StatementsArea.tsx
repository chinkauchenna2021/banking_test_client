import React from 'react';

export default function StatementsArea() {
  return (
    <section className="statements-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="statements-content-box">
              <ul>
                <li>
                  <div className="single-statements-box">
                    <div className="img-box">
                      <img src="/assets/images/resources/statements-1.jpg" alt="Mission" />
                      <div className="static-content">
                        <h2>Mission</h2>
                      </div>
                      <div className="overlay-content">m</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="single-statements-box">
                    <div className="img-box">
                      <img src="/assets/images/resources/statements-2.jpg" alt="Vision" />
                      <div className="static-content">
                        <h2>Vision</h2>
                      </div>
                      <div className="overlay-content">v</div>
                    </div>
                  </div>
                  <div className="single-statements-box">
                    <div className="img-box">
                      <img src="/assets/images/resources/statements-3.jpg" alt="Core Value" />
                      <div className="static-content">
                        <h2>Core Value</h2>
                      </div>
                      <div className="overlay-content">c</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="statements-text-box">
              <div className="shape">
                <span className="icon-origami"></span>
              </div>
              <div className="inner-title">
                <h2>Our Banking<br /> Mission Statement</h2>
              </div>
              <div className="text">
                <p>To empower individuals and businesses with innovative digital banking solutions that simplify financial management while maintaining the highest standards of security and customer service. We believe in making advanced banking accessible to everyone through technology.</p>
                <div className="btn-box">
                  <a href="/about"><span className="icon-right-arrow"></span>Learn More About Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}