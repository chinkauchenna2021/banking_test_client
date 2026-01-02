import Link from 'next/link';
import SubLayout from './SubLayout';
import Image from 'next/image';

export default function Footer() {
  const usefulLinks = [
    'Our Story',
    'Board of Directors',
    'Management Committee',
    'Media',
    'Investor Relations',
    'Awards & Recognition',
    'Careers'
  ];

  const services = [
    'Savings Account',
    'Current Account',
    'Deposits',
    'Cards',
    'Trading & Demat a/c',
    'Insurance',
    'Locker Facility'
  ];

  return (
    <footer className='footer-area footer-area--style3'>
      {/* Footer Top */}
      <div className='footer-top'>
        <div className='container'>
          <div className='row'>
            {/* Company Info */}
            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 single-widget'>
              <div className='single-footer-widget single-footer-widget--link-box'>
                <div className='our-company-info'>
                  <div className='footer-logo-style1'>
                    <Link href='/'>
                      <Image
                        src='/assets/images/resources/fidelity_logo.png'
                        alt='Fidelitybank Logo'
                      />
                    </Link>
                  </div>
                  <div className='bottom-text'>
                    <p>
                      Our goal is to help our companies all maintains of achieve
                      best position team work occurings works the wise man
                      therefore always holds these in matters to this principle.
                    </p>
                  </div>
                  <div className='footer-certificate-box'>
                    <div className='icon'>
                      <span className='icon-certificate'></span>
                    </div>
                    <div className='title'>
                      <h3>
                        Banker's Bank of the
                        <br /> Year 2021
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 single-widget'>
              <div className='single-footer-widget single-footer-widget--link-box'>
                <div className='title'>
                  <h3>Useful Links</h3>
                </div>
                <div className='footer-widget-links'>
                  <ul>
                    {usefulLinks.map((link, index) => (
                      <li key={index}>
                        <a href='#'>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 single-widget'>
              <div className='single-footer-widget single-footer-widget--link-box'>
                <div className='title'>
                  <h3>Services</h3>
                </div>
                <div className='footer-widget-links'>
                  <ul>
                    {services.map((service, index) => (
                      <li key={index}>
                        <a href='#'>{service}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Find Branch */}
            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-12 single-widget'>
              <div className='single-footer-widget single-footer-widget--link-box'>
                <div className='find-nearest-branch-box-style2'>
                  <div className='icon'>
                    <span className='icon-map'></span>
                  </div>
                  <h3>
                    Find Your Nearest
                    <br /> Branch & ATM
                  </h3>

                  <form id='nearest-branch-form' className='default-form2'>
                    <div className='input-box'>
                      <div className='select-box clearfix'>
                        <select className='wide'>
                          <option value=''>Branch</option>
                          <option value='canada'>Canada</option>
                          <option value='usa'>USA</option>
                          <option value='ksa'>KSA</option>
                          <option value='india'>India</option>
                        </select>
                      </div>
                    </div>
                    <div className='input-box'>
                      <input
                        type='text'
                        name='city'
                        id='formCity'
                        placeholder='Enter your city'
                        required
                      />
                    </div>
                    <div className='button-box'>
                      <button type='submit'>
                        <span className='icon-right-arrow'></span> Find On Map
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='footer-bottom'>
        <div className='container'>
          <div className='bottom-inner'>
            <div className='footer-menu'>
              <ul>
                <li>
                  <a href='#'>Disclaimer</a>
                </li>
                <li>
                  <a href='#'>Privacy Policy</a>
                </li>
                <li>
                  <a href='#'>Terms & Conditions</a>
                </li>
                <li>
                  <a href='#'>Online Security Tips</a>
                </li>
              </ul>
            </div>
            <div className='footer-social-link'>
              <ul className='clearfix'>
                <li>
                  <a href='#'>
                    <i className='fab fa-youtube'></i>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <i className='fab fa-instagram'></i>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <i className='fab fa-twitter'></i>
                  </a>
                </li>
                <li>
                  <a href='#'>
                    <i className='fab fa-facebook-f'></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
