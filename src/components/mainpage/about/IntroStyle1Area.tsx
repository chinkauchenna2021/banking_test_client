import React from 'react';

export default function IntroStyle1Area() {
  return (
    <section className="intro-style1-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="intro-style1-video-gallery">
              <div 
                className="intro-style1-video-gallery-bg"
                style={{ backgroundImage: 'url(/assets/images/resources/intro-style1-video-gallery.jpg)' }}
              >
              </div>
              <div className="intro-video-gallery-style1">
                <div className="icon wow zoomIn animated" data-wow-delay="300ms" data-wow-duration="1500ms">
                  <a className="video-popup" title="Video Gallery" href="https://www.youtube.com/watch?v=06dV9txztKY">
                    <span className="icon-play-button-1"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="intro-style1-content-box">
              <div className="sec-title">
                <h2>Digital Banking<br /> Built on Trust &<br /> Innovation</h2>
              </div>
              <div className="text">
                <p>For over a decade, FinFlow has redefined banking with secure digital solutions that put our customers first. We combine cutting-edge technology with personalized service to make managing money simpler, smarter, and more secure.</p>
                <p>Our commitment to innovation ensures you have access to the latest banking tools while maintaining the highest security standards. From mobile banking to investment services, we provide comprehensive financial solutions for every stage of life.</p>
              </div>

              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6">
                  <div className="intro-style1-single-box">
                    <div className="img-box">
                      <div className="img-box-inner">
                        <img src="/assets/images/resources/intro-style1-1.jpg" alt="Our Journey" />
                      </div>
                      <div className="overlay-text">
                        <h3>Our Journey</h3>
                      </div>
                    </div>
                    <div className="title-box">
                      <h3><a href="/about">A Decade of Digital<br /> Banking Excellence</a></h3>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6">
                  <div className="intro-style1-single-box">
                    <div className="img-box">
                      <div className="img-box-inner">
                        <img src="/assets/images/resources/intro-style1-2.jpg" alt="Our Team" />
                      </div>
                      <div className="overlay-text">
                        <h3>Our Team</h3>
                      </div>
                    </div>
                    <div className="title-box">
                      <h3><a href="/team">Expert Financial<br /> Advisors & Support</a></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}