// app/components/ServiceRequest.tsx
interface ServiceItem {
  id: number
  icon: string
  title: string
  link: string
}

const serviceItems: ServiceItem[] = [
  {
    id: 1,
    icon: 'icon-credit-card',
    title: 'Credit & Debit Card<br /> Related',
    link: '#'
  },
  {
    id: 2,
    icon: 'icon-computer',
    title: 'Mobile & Internet<br /> Banking',
    link: '#'
  },
  {
    id: 3,
    icon: 'icon-book',
    title: 'Account & Personal<br /> Details Change',
    link: '#'
  },
  {
    id: 4,
    icon: 'icon-check-book',
    title: 'Cheque Book / DD<br /> Related',
    link: '#'
  }
]

export default function ServiceRequest() {
  return (
    <section className="service-request-style2-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="service-request-style2-img-box">
              <div className="service-request-style2-img-box__inner">
                <img src="/assets/images/resources/service-request-style2.jpg" alt="Service Request" />
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="service-request-style2-content-box">
              <div
                className="pattern-bottom"
                style={{ backgroundImage: 'url(/assets/images/shapes/service-request-style2-content-box-pattern.png)' }}
              ></div>
              <div className="sec-title">
                <h2>Online Emergency<br /> Service Requests All In<br /> One Place</h2>
                <div className="sub-title">
                  <p>Desire that they cannot foresee the pain & trouble that are bound too ensue equal blame belongs through shrinking.</p>
                </div>
              </div>
              <div className="service-request-style2-content-box__inner">
                <ul>
                  {serviceItems.map((item) => (
                    <li key={item.id}>
                      <div className="single-service-request-style2-box">
                        <div className="icon">
                          <span className={item.icon}></span>
                        </div>
                        <div className="title">
                          <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                          <a href={item.link}>
                            <span className="icon-right-arrow"></span>
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="service-request-style2__btns-box">
                  <a className="btn-one" href="#">
                    <span className="txt">Customer FAQ&apos;s</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}