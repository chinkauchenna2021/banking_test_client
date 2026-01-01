import React from 'react';
import  {
    Landmark,
    FileUser,
    BanknoteIcon,
    CircleDollarSign
} from 'lucide-react'

interface FactItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const factItems: FactItem[] = [
  {
    icon: <Landmark className="!w-14 !h-14" />,
    title: 'Digital Network',
    description: '1.8 million active digital banking users'
  },
  {
    icon: <FileUser className="!w-14 !h-14" />,
    title: 'Customer Satisfaction',
    description: '96% customer satisfaction rating'
  },
  {
    icon: <BanknoteIcon className="!w-20 !h-14" />,
    title: 'Transactions Processed',
    description: '$45B+ in annual transaction volume'
  },
  {
    icon: <CircleDollarSign className="!w-14 !h-14" />,
    title: 'Loans Approved',
    description: '$2.3B in consumer loans approved'
  }
];

export default function FactsArea() {
  return (
    <section className="facts-area">
      <div 
        className="facts-area-bg" 
        style={{ backgroundImage: 'url(/assets/images/backgrounds/facts-area-bg.jpg)' }}
      >
      </div>
      <div className="container">
        <div className="sec-title text-center">
          <h2>Digital Banking By The Numbers</h2>
          <div className="sub-title">
            <p>Key metrics that demonstrate our commitment to financial innovation</p>
          </div>
        </div>
        <div className="row">
          {factItems.map((item, index) => (
            <div key={index} className="col-xl-3 col-lg-6 col-md-6">
              <div className="single-fact-box">
                <div className="icon">
                  {item.icon}
                </div>
                <div className="text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}