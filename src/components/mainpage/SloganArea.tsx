// app/components/SloganArea.tsx
export default function SloganArea() {
  return (
    <section className="slogan-area slogan-area--style2">
      <div className="container">
        <div className="slogan-content-box slogan-content-box--style2">
          <div 
            className="slogan-content-box-bg"
            style={{ backgroundImage: 'url(/assets/images/backgrounds/slogan-content-box-bg.jpg)' }}
          ></div>
          <div className="inner-title">
            <h2>Experience a New Digital World.</h2>
            <p>Mobile banking application with new & exciting features.</p>
          </div>
          <div className="get-app-box">
            <ul>
              <li>
                <a href="#">
                  <div className="icon">
                    <span className="icon-play-store"></span>
                  </div>
                  <div className="text">
                    <h4>Download</h4>
                  </div>
                </a>
              </li>
              <li>
                <a className="style2" href="#">
                  <div className="icon">
                    <span className="icon-apple"></span>
                  </div>
                  <div className="text">
                    <h4>Download</h4>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}