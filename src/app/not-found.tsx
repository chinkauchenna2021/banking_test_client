import React from 'react';
import BreadcrumbArea from '@/components/BreadcrumbArea'

export default function NotFoundPage() {
  return (
    <>
      <BreadcrumbArea 
        title="404 Error"
        backgroundImage="/assets/images/backgrounds/breadcrumb-area-bg.jpg"
        links={[
          { name: 'Home', href: '/' },
          { name: '404', href: '#', active: true }
        ]}
      />

      <section className="error-page-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="error-content text-center">
                <div className="big-title wow fadeInDown" data-wow-delay="100ms" data-wow-duration="1500ms">
                  <h2>Oh...ho...</h2>
                </div>
                <div className="title wow fadeInDown" data-wow-delay="100ms" data-wow-duration="1500ms">
                  <h2>Sorry, Something Went Wrong.</h2>
                </div>
                <div className="text">
                  <p>The page you are looking for was moved, removed, renamed<br /> or never existed.</p>
                </div>

                <div className="error-page-search-box">
                  <form className="search-form" action="#">
                    <input placeholder="Search ..." type="text" />
                    <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                  </form>
                </div>
                <div className="btns-box wow slideInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                  <a className="btn-one" href="/">
                    <span className="txt">Back to Home<i className="icon-refresh arrow"></i></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}