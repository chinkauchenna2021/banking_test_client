// app/components/AccountSteps.tsx
interface Step {
  id: number
  icon: string
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    id: 1,
    icon: 'icon-consultation',
    number: '01',
    title: 'Consult With Team',
    description: 'Must explain to you how work mistaken give you complete guide they cannot foresee pain.'
  },
  {
    id: 2,
    icon: 'icon-file-1',
    number: '02',
    title: 'KYC Verification',
    description: 'Business it will frequently occur that pleasures have to be repudiated and annoyances accepted.'
  },
  {
    id: 3,
    icon: 'icon-investment',
    number: '03',
    title: 'Start Your Savings',
    description: 'Being able to do what we like best every pleasure is to be welcomed and pain avoided but in certain.'
  }
]

export default function AccountSteps() {
  return (
    <section className="account-steps-area">
      <div className="container">
        <div className="sec-title text-center">
          <h2>Your Account in Easy Steps</h2>
          <div className="sub-title">
            <p>We show our value by serving faithfully.</p>
          </div>
        </div>
        <ul className="row account-steps__content">
          {steps.map((step) => (
            <li key={step.id} className="col-xl-4 single-account-steps-colum text-center">
              <div className="single-account-steps">
                <div className="icon">
                  <div className="icon-inner">
                    <span className={step.icon}></span>
                  </div>
                  <div className="counting">{step.number}</div>
                </div>
                <div className="text">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="row">
          <div className="col-xl-12">
            <div className="account-steps-area__bottom-text">
              <p>Schedule an appointment with our specialist to discuss <a href="#">contact us.</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}