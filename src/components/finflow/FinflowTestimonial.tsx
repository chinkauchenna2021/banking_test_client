'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { testimonials } from '@/app/data/bankingData'

export default function FinflowTestimonial() {
  return (
    <section className="finflow-testimonial-area">
      <div className="container">
        <div className="testimonial-wrapper">
          <div className="row align-items-center">
            <div className="col-xl-4">
              <div className="testimonial-image">
                <img 
                  src="/assets/images/site/Online-Banking-Testimonial-Image.webp" 
                  alt="Testimonial" 
                />
              </div>
            </div>
            <div className="col-xl-8">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                className="testimonial-slider"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-content">
                      <div className="testimonial-logo">
                        <img 
                          src="/assets/images/site/Online-Banking-Testimonial-Logo.webp" 
                          alt="Company Logo" 
                        />
                      </div>
                      <blockquote>
                        "{testimonial.text}"
                      </blockquote>
                      <div className="testimonial-author">
                        <h4>{testimonial.name}</h4>
                        {testimonial.company && (
                          <span className="author-company">{testimonial.company}</span>
                        )}
                        <span className="author-location">{testimonial.location}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}