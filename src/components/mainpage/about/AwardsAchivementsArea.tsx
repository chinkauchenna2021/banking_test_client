import React from 'react';

interface AwardItem {
  icon: string;
  title: string;
  year: string;
  awardedBy: string;
}

const leftAwards: AwardItem[] = [
  {
    icon: '/assets/images/icon/award-1.png',
    title: 'Best Digital Bank 2023',
    year: '2023',
    awardedBy: 'Global Finance Magazine'
  },
  {
    icon: '/assets/images/icon/award-1.png',
    title: 'Mobile Banking Excellence',
    year: '2022',
    awardedBy: 'FinTech Innovation Awards'
  }
];

const rightAwards: AwardItem[] = [
  {
    icon: '/assets/images/icon/award-1.png',
    title: 'Best Customer Service',
    year: '2023',
    awardedBy: 'J.D. Power & Associates'
  },
  {
    icon: '/assets/images/icon/award-1.png',
    title: 'Top Mobile Banking App',
    year: '2022',
    awardedBy: 'Forbes Advisor'
  }
];

export default function AwardsAchivementsArea() {
  return (
    <section className="awards-achivements-area" style={{ backgroundColor: '#f7f1eb' }}>
      <div className="container">
        <div className="sec-title text-center">
          <h2>Awards & Major Achievements</h2>
          <div className="sub-title">
            <p>Recognized for excellence in digital banking and customer service</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4">
            <div className="awards-achivements-left-box">
              {leftAwards.map((award, index) => (
                <div key={index} className="single-awards-achivements-box">
                  <div className="top">
                    <div className="icon">
                      <img src={award.icon} alt="Award" />
                    </div>
                    <div className="inner-title">
                      <h3>{award.title}</h3>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <span>Year</span><b>:</b> {award.year}
                    </li>
                    <li>
                      <span>Awarded by</span><b>:</b> {award.awardedBy}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="col-xl-4">
            <div className="awards-img-box">
              <div className="round-box"></div>
              <div className="shape1">
                <img src="/assets/images/resources/trophy-shape-1.png" alt="Trophy Shape" />
              </div>
              <div className="shape2">
                <img src="/assets/images/resources/trophy-shape-2.png" alt="Trophy Shape" />
              </div>
              <div className="inner">
                <img src="/assets/images/resources/trophy.png" alt="Trophy" />
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="awards-achivements-right-box">
              {rightAwards.map((award, index) => (
                <div key={index} className="single-awards-achivements-box">
                  <div className="top">
                    <div className="icon">
                      <img src={award.icon} alt="Award" />
                    </div>
                    <div className="inner-title">
                      <h3>{award.title}</h3>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <span>Year</span><b>:</b> {award.year}
                    </li>
                    <li>
                      <span>Awarded by</span><b>:</b> {award.awardedBy}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}