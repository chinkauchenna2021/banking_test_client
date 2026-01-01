// app/components/BenefitsSection.tsx
interface Benefit {
  id: number
  icon: string
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    id: 1,
    icon: 'icon-high',
    title: 'Earn Interest up to 7%',
    description: 'Holds these matters principles selection right some rejects.'
  },
  {
    id: 2,
    icon: 'icon-notification',
    title: 'Free SMS Alerts',
    description: 'Business will frequently occur that pleasure have to be repudiated.'
  },
  {
    id: 3,
    icon: 'icon-safebox',
    title: 'Discounts on Locker',
    description: 'The wise man therefore always holds these principle of selection.'
  },
  {
    id: 4,
    icon: 'icon-credit-card-2',
    title: 'International Debit Cards',
    description: 'The wise man therefore always holds these principle of selection.'
  },
  {
    id: 5,
    icon: 'icon-shield-1',
    title: 'Provides Safety',
    description: 'Holds these matters principles selection right some rejects.'
  },
  {
    id: 6,
    icon: 'icon-paperless',
    title: 'Paperless Banking',
    description: 'Business will frequently occur that pleasure have to be repudiated.'
  }
]

export default function BenefitsSection() {
  return (
    <section className="benefits-area">
      <div className="container">
        <div className="sec-title text-center">
          <h2>Benefits for Account Holders</h2>
          <div className="sub-title">
            <p>We help businesses and customers achieve more.</p>
          </div>
        </div>
        <ul className="row benefits-content text-center">
          {benefits.map((benefit) => (
            <li key={benefit.id} className="col-xl-4 single-benefits-box-colum">
              <div className="single-benefits-box">
                <div className="icon">
                  <span className={benefit.icon}></span>
                </div>
                <div className="text">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}