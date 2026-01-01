'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { slides } from '@/app/data/bankingData'

export default function FinflowHero() {
  return (
    <section className="main-slider main-slider-style3 finflow-hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '#main-slider-pagination',
        }}
        navigation={{
          nextEl: '#main-slider__swiper-button-next',
          prevEl: '#main-slider__swiper-button-prev',
        }}
        className="thm-swiper__slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="image-layer" 
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="main-slider-content">
                    <div className="main-slider-content__inner">
                      <div className="finflow-hero-subtitle">
                        <h5 className='lg:text-[400px]'>All-in-one banking for everyone</h5>
                      </div>
                      <div 
                        className="big-title" 
                        dangerouslySetInnerHTML={{ __html: slide.title }}
                      />
                      <div 
                        className="text" 
                        dangerouslySetInnerHTML={{ __html: slide.description }}
                      />
                      <div className="btns-box">
                        <div className="email-subscription">
                          {/* <form className="finflow-email-form">
                            <input 
                              type="email" 
                              placeholder="Enter your email" 
                              required 
                            />
                            <button type="submit" className="btn-one">
                              <span className="txt">{slide.buttonText}</span>
                            </button>
                          </form> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <div className="main-slider__nav main-slider__nav--style3">
          <div className="swiper-button-prev">
            <i className="icon-chevron left"></i>
          </div>
          <div className="swiper-button-next">
            <i className="icon-chevron right"></i>
          </div>
        </div>
      </Swiper>
    </section>
  )
}