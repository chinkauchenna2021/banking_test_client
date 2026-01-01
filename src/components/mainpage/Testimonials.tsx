// app/components/Testimonials.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'

interface Testimonial {
  id: number
  name: string
  location: string
  image: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Nathan Felix',
    location: 'California',
    image: '/assets/images/testimonial/testimonial-v1-1.jpg',
    text: 'Experience with Finbank has been very accommodating for they have online banking. When I need to transfer funds and pay bills it can be done at my convenience.',
    rating: 5
  },
  {
    id: 2,
    name: 'Nora Penelope',
    location: 'Newyork',
    image: '/assets/images/testimonial/testimonial-v1-2.jpg',
    text: 'My experience with transitioning has been great. Everyone at thebank has been extremely accommodating. They make me feel that my business matters.',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="testimonials-style1-area">
      <div className="container">
        <div className="sec-title text-center">
          <h2>Check Out Customer Feedback</h2>
          <div className="sub-title">
            <p>Pleasure to share some of our customers feedback.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.testimonials-next',
                prevEl: '.testimonials-prev',
              }}
              breakpoints={{
                992: {
                  slidesPerView: 2,
                }
              }}
              className="owl-carousel owl-theme thm-owl__carousel testimonials-style1-carousel owl-nav-style-one"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="single-testimonials-style1">
                    <div className="quote-box">
                      <span className="icon-quote"></span>
                    </div>
                    <div className="customer-info">
                      <div className="img-box">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </div>
                      <div className="title-box">
                        <h3>{testimonial.name}</h3>
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                    <div className="inner">
                      <div className="text-box">
                        <p>{testimonial.text}</p>
                      </div>
                      <div className="review-box">
                        <ul>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <li key={i}><i className="fa fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* Custom Navigation */}
              <div className="testimonials-prev left icon-right-arrow"></div>
              <div className="testimonials-next right icon-right-arrow"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}