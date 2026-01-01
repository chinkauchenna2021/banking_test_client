import React from 'react';

export default function StatisticsArea() {
  return (
    <section className="statistics-area">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="statistics-content-box">
              <div className="sec-title">
                <h2>Data-Driven<br /> Banking Solutions</h2>
              </div>
              <div className="text">
                <p>Our analytics-driven approach helps customers make smarter financial decisions. With real-time insights and personalized recommendations, we transform complex financial data into actionable strategies for growth and security.</p>
              </div>
              <div className="download-box">
                <div className="icon">
                  <span className="icon-pdf"></span>
                </div>
                <div className="title">
                  <h5><a href="/financial-reports">Download</a></h5>
                  <h3>Annual Financial Report 2023</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="statistics-chart">
              <img src="/assets/images/resources/statistics-chart.png" alt="Banking Statistics Chart" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}