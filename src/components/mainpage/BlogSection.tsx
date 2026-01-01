'use client'

interface BlogPost {
  id: number
  image: string
  category: string
  categoryIcon: string
  date: string
  author: string
  authorLink: string
  title: string
  readTime: string
  comments: string
  link: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: '/assets/images/blog/blog-v2-1.jpg',
    category: 'Banking',
    categoryIcon: 'icon-play-button-1',
    date: 'May 29, 2022',
    author: 'Henry Theo',
    authorLink: '#',
    title: 'How Non-US Citizens can Open<br /> a Bank Account',
    readTime: '6 Mins Read',
    comments: '10 Cmnts',
    link: '/blog/single-post'
  },
  {
    id: 2,
    image: '/assets/images/blog/blog-v2-2.jpg',
    category: 'Press Release',
    categoryIcon: 'icon-play-button-1',
    date: 'May 25, 2022',
    author: 'Roman Frederick',
    authorLink: '#',
    title: 'Board Approves Capital Raise of<br /> Rs. 2000 Crores',
    readTime: '6 Mins Read',
    comments: '10 Cmnts',
    link: '/blog/single-post'
  }
]

export default function BlogSection() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    console.log('Subscribed')
  }

  return (
    <section className="blog-style2-area">
      <div className="blog-style2-area__shape1">
        <img src="/assets/images/shapes/blog-style2-shape-1.png" alt="" />
      </div>
      <div className="blog-style2-area__shape2">
        <img src="/assets/images/shapes/blog-style2-shape-2.png" alt="" />
      </div>
      <div className="container">
        <div className="blog-style2-area__top">
          <div className="sec-title">
            <h2>Latest From News Room</h2>
            <div className="sub-title">
              <p>Our blog post provides you all the updates & guides.</p>
            </div>
          </div>
          <div className="btns-box">
            <a className="btn-one" href="/blog">
              <span className="txt">View All Post</span>
            </a>
          </div>
        </div>

        <div className="row">
          {blogPosts.map((post) => (
            <div key={post.id} className="col-xl-6">
              <div className="single-blog-style1 single-blog-style1--style2">
                <div className="img-holder">
                  <div className="inner">
                    <img src={post.image} alt={post.title} />
                    <div className="overlay-icon">
                      <a href={post.link}>
                        <span className="icon-right-arrow"></span>
                      </a>
                    </div>
                  </div>
                  <div className="category-date-box">
                    <div className="category">
                      <span className={post.categoryIcon}></span>
                      <h5>{post.category}</h5>
                    </div>
                    <div className="date">
                      <h5>{post.date}</h5>
                    </div>
                    <div className="author">
                      <h5>
                        By <a href={post.authorLink}>{post.author}</a>
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="text-holder">
                  <h3 className="blog-title">
                    <a href={post.link} dangerouslySetInnerHTML={{ __html: post.title }} />
                  </h3>
                  <div className="bottom">
                    <div className="read-more-btn">
                      <a href={post.link}>
                        <span className="icon-right-arrow"></span>Read More
                      </a>
                    </div>
                    <div className="meta-box">
                      <ul className="meta-info">
                        <li>
                          <span className="icon-clock"></span>
                          <a href="#">{post.readTime}</a>
                        </li>
                        <li>
                          <span className="icon-comment"></span>
                          <a href="#">{post.comments}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="subscribe-box-style1 subscribe-box-style1--style2">
              <div className="icon">
                <img src="/assets/images/icon/subscribe-2.png" alt="" />
              </div>
              <div className="inner-title">
                <h3>Subscribe us to<br /> Recieve Career Updates</h3>
              </div>
              <form className="subscribe-form-style1" onSubmit={handleSubscribe}>
                <div className="input-box">
                  <input type="email" name="email" placeholder="Email address" required />
                  <div className="inner-icon">
                    <i className="far fa-envelope-open"></i>
                  </div>
                </div>
                <button className="btn-one" type="submit">
                  <span className="txt">Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}