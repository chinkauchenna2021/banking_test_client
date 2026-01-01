'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

interface Slide {
  id: number
  image: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/slides/slide-v3-1.jpg',
    title: 'Convenient<br /> Banking Options',
    description: 'On the other hand, we denounce with righteous indignation<br /> and dislike men who are so beguiled.',
    buttonText: 'Our Services',
    buttonLink: '/services'
  },
  {
    id: 2,
    image: '/assets/images/slides/slide-v3-2.jpg',
    title: 'Make a Pay<br /> Anyone & Anywhere',
    description: 'On the other hand, we denounce with righteous indignation<br /> and dislike men who are so beguiled.',
    buttonText: 'Make Payment',
    buttonLink: '/payment'
  },
  {
    id: 3,
    image: '/assets/images/slides/slide-v3-3.jpg',
    title: 'Make Yourself<br /> Richer and Smarter',
    description: 'On the other hand, we denounce with righteous indignation<br /> and dislike men who are so beguiled.',
    buttonText: 'Start Your Investment',
    buttonLink: '/investment'
  }
]

export default function HeroSlider() {
  return (
    <section className="main-slider main-slider-style3">
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
                      {/* Add responsive text classes here */}
                      <div 
                        className="big-title !text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                        dangerouslySetInnerHTML={{ __html: slide.title }}
                      />
                      <div 
                        className="text text-slate-400 text-base md:text-lg lg:text-xl mt-4 md:mt-6"
                        dangerouslySetInnerHTML={{ __html: slide.description }}
                      />
                      <div className="btns-box mt-8 md:mt-12">
                        <a className="btn-one" href={slide.buttonLink}>
                          <span className="txt">{slide.buttonText}</span>
                        </a>
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
          {/* <div className="swiper-button-prev" id="main-slider__swiper-button-prev"> */}
          <div className="swiper-button-prev" id=""> 
            <i className="icon-chevron left"></i>
             <i className=""></i>
          </div>
          {/* <div className="swiper-button-next" id="main-slider__swiper-button-next"> */}
          <div className="swiper-button-next" id="">
            <i className="icon-chevron right"></i>
             <i className=""></i>
          </div>
        </div>
      </Swiper>
    </section>
  )
}