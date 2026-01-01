// app/components/PartnerCarousel.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const partners = [
  { id: 1, logo: '/assets/images/brand/brand-1-1.png', link: '#' },
  { id: 2, logo: '/assets/images/brand/brand-1-2.png', link: '#' },
  { id: 3, logo: '/assets/images/brand/brand-1-3.png', link: '#' },
  { id: 4, logo: '/assets/images/brand/brand-1-4.png', link: '#' },
  { id: 5, logo: '/assets/images/brand/brand-1-5.png', link: '#' },
  { id: 6, logo: '/assets/images/brand/brand-1-6.png', link: '#' },
]

export default function PartnerCarousel() {
  return (
    <section className="partner-style2-area">
      <div className="container">
        <div className="brand-content">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={25}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 6,
              },
            }}
            className="thm-owl__carousel partner-carousel"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="single-partner-logo-box">
                  <a href={partner.link}>
                    <img src={partner.logo} alt="Partner Logo" />
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}