import React from 'react';

interface ChooseItem {
  icon: string;
  number: string;
  title: string;
  description: string;
}

const chooseItems: ChooseItem[] = [
  {
    icon: 'icon-crowd',
    number: '01',
    title: 'Customer-Centric Approach',
    description: 'We prioritize your financial well-being with personalized banking solutions and 24/7 customer support designed around your needs.'
  },
  {
    icon: 'icon-commitment',
    number: '02',
    title: 'Innovation & Technology',
    description: 'Leveraging cutting-edge fintech solutions to provide secure, efficient, and convenient banking experiences through our mobile-first platform.'
  },
  {
    icon: 'icon-consistency',
    number: '03',
    title: 'Financial Security',
    description: 'Your security is our top priority. We employ bank-level encryption, fraud monitoring, and FDIC insurance to protect your assets.'
  }
];

export default function ChooseStyle1Area() {
  return (
    <section className="choose-style1-area">
      <div className="container">
        <ul className="row choose-style1__content">
          {chooseItems.map((item, index) => (
            <li key={index} className="col-xl-4 col-lg-4 single-choose-style1-colum text-center">
              <div className="single-choose-style1">
                <div className="icon">
                  <div className="icon-inner">
                    <span className={item.icon}></span>
                  </div>
                  <div className="counting">{item.number}</div>
                </div>
                <div className="text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}