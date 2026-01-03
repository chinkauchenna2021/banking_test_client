import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Preloader from './Preloader';
import '../../app/finflow.css';
import 'aos/dist/aos.css';
import Script from 'next/script';
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div>
        {/* <link rel="apple-touch-icon" sizes="180x180" href="http://localhost:3000/assets/images/favicons/apple-touch-icon.png" /> */}
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='http://localhost:3000/assets/images/favicons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='http://localhost:3000/assets/images/favicons/favicon-16x16.png'
        />
        {/* <link rel="manifest" href="http://localhost:3000/assets/images/favicons/site.webmanifest" /> */}
        <meta name='description' content='fidelity Offshore Bank' />
        <link
          href='https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'
          rel='stylesheet'
        />

        <link rel='stylesheet' href='/assets/vendors/animate/animate.min.css' />
        <link
          rel='stylesheet'
          href='/assets/vendors/animate/custom-animate.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/bootstrap/css/bootstrap.min.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/bxslider/jquery.bxslider.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/fontawesome/css/all.min.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.css'
        />
        <link rel='stylesheet' href='/assets/vendors/jquery-ui/jquery-ui.css' />
        <link
          rel='stylesheet'
          href='/assets/vendors/nice-select/nice-select.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/odometer/odometer.min.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/owl-carousel/owl.carousel.min.css'
        />
        <link
          rel='stylesheet'
          href='/assets/vendors/owl-carousel/owl.theme.default.min.css'
        />
        <link rel='stylesheet' href='/assets/vendors/swiper/swiper.min.css' />
        <link
          rel='stylesheet'
          href='/assets/vendors/nice-select/nice-select.css'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/vegas/2.6.0/vegas.css'
        />
        {/* <link rel="stylesheet" href="/assets/vendors/vegas/vegas.min.css" /> */}
        <link rel='stylesheet' href='/assets/vendors/thm-icons/style.css' />
        <link
          rel='stylesheet'
          href='/assets/vendors/language-switcher/polyglot-language-switcher.css'
        />
        <link rel='stylesheet' href='/assets/vendors/aos/aos.css' />

        <link
          rel='stylesheet'
          href='/assets/css/module-css/01-header-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/02-banner-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/03-about-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/04-fact-counter-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/05-testimonial-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/06-partner-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/07-footer-section.css'
        />
        <link
          rel='stylesheet'
          href='/assets/css/module-css/08-blog-section.css'
        />

        <link rel='stylesheet' href='/assets/css/style.css' />
        <link rel='stylesheet' href='/assets/css/color-2.css' />
        <link rel='stylesheet' href='/assets/css/responsive.css' />
      </div>
      <div>
        <div>
          {/* <Preloader /> */}
          <div className='page-wrapper'>
            <Header />
            {children}
            <Footer />
            {/* Mobile Navigation */}
            <MobileNav />
            {/* Search Popup */}
            <SearchPopup />
            {/* Scroll to Top */}
            <ScrollToTop />
          </div>
        </div>

        <Script
          src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery/jquery-3.6.0.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/bootstrap/js/bootstrap.bundle.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/bxslider/jquery.bxslider.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/circleType/jquery.circleType.js'
          strategy='afterInteractive'
        />
        <Script
          src='https://cdnjs.cloudflare.com/ajax/libs/lettering.js/0.7.0/jquery.lettering.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/isotope/isotope.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-ajaxchimp/jquery.ajaxchimp.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-appear/jquery.appear.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-migrate/jquery-migrate.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-ui/jquery-ui.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/jquery-validate/jquery.validate.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/nice-select/jquery.nice-select.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/odometer/odometer.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/owl-carousel/owl.carousel.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/swiper/swiper.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='https://cdnjs.cloudflare.com/ajax/libs/vegas/2.6.0/vegas.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/wnumb/wNumb.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/wow/wow.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/extra-scripts/jquery.paroller.min.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/language-switcher/jquery.polyglot.language.switcher.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/vendors/aos/aos.js'
          strategy='afterInteractive'
        />
        <Script
          src='http://localhost:3000/assets/js/custom.js'
          strategy='afterInteractive'
        />
      </div>
    </div>
  );
}

// Mobile Navigation Component
function MobileNav() {
  return (
    <div className='mobile-nav__wrapper'>
      <div className='mobile-nav__overlay mobile-nav__toggler'></div>
      <div className='mobile-nav__content'>
        <span className='mobile-nav__close mobile-nav__toggler'>
          <i className='fas fa-plus'></i>
        </span>
        <div className='logo-box'>
          <a href='/' aria-label='logo image'>
            <div className='-mt-1 flex w-full flex-row items-center justify-start space-x-4'>
              {/* <img src='/assets/images/resources/mobile-nav-logo.png' alt='' /> */}

              <img
                className='h-14 w-20 md:h-12 md:w-32'
                src='/assets/images/shapes/card-banner-area-bg.png'
                alt='Fidelitybank Logo'
              />
              <div className='h-fit w-fit'>
                <h3 className='text-md! md:text-md! font-extrabold tracking-wide text-white'>
                  Fidelity Offshore
                </h3>
              </div>
            </div>
          </a>
        </div>
        <div className='mobile-nav__container'></div>
        <ul className='mobile-nav__contact list-unstyled'>
          <li>
            <i className='fa fa-envelope'></i>
            <a href='mailto:info@example.com'>info@example.com</a>
          </li>
          <li>
            <i className='fa fa-phone-alt'></i>
            <a href='tel:123456789'>444 000 777 66</a>
          </li>
        </ul>
        <div className='mobile-nav__social'>
          <a href='#' className='fab fa-twitter'></a>
          <a href='#' className='fab fa-facebook-square'></a>
          <a href='#' className='fab fa-pinterest-p'></a>
          <a href='#' className='fab fa-instagram'></a>
        </div>
      </div>
    </div>
  );
}

// Search Popup Component
function SearchPopup() {
  return (
    <div className='search-popup'>
      <div className='search-popup__overlay search-toggler'></div>
      <div className='search-popup__content'>
        <form action='#'>
          <label htmlFor='search' className='sr-only'>
            search here
          </label>
          <input type='text' id='search' placeholder='Search Here...' />
          <button type='submit' aria-label='search submit' className='thm-btn'>
            <i className='icon-search'></i>
          </button>
        </form>
      </div>
    </div>
  );
}

// Scroll to Top Component
function ScrollToTop() {
  return (
    <a href='#' data-target='html' className='scroll-to-target scroll-to-top'>
      <i className='icon-chevron'></i>
    </a>
  );
}
