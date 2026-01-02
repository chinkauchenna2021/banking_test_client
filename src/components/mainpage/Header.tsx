'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MenuItem {
  title: string;
  href: string;
  submenu?: MenuItem[];
}

interface MegaMenuProps {
  items: Array<{
    title: string;
    image: string;
    multiPageLink: string;
    onePageLink: string;
    multiPageText: string;
    onePageText: string;
  }>;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ items }) => {
  return (
    <div className='megamenu-content-box'>
      <div className='container'>
        <div className='megamenu-content-box__inner'>
          <div className='row'>
            {items.map((item, index) => (
              <div className='col-lg-3' key={index}>
                <div className='home-showcase__item'>
                  <div className='home-showcase__image'>
                    <img
                      src={`/assets/images/home-showcase/${item.image}`}
                      alt={item.title}
                    />
                    <div className='home-showcase__buttons'>
                      <Link
                        href={item.multiPageLink}
                        className='btn-one home-showcase__buttons__item top'
                      >
                        <span className='txt'>{item.multiPageText}</span>
                      </Link>
                      <Link
                        href={item.onePageLink}
                        className='btn-one home-showcase__buttons__item'
                      >
                        <span className='txt'>{item.onePageText}</span>
                      </Link>
                    </div>
                  </div>
                  <h3 className='home-showcase__title'>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// MenuItem Component with active state
const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if current path matches item href
  const isActive =
    pathname === item.href ||
    (item.href !== '/' && pathname?.startsWith(item.href));

  // For submenu items, also check if any child is active
  const hasActiveChild = item.submenu?.some(
    (subItem) =>
      pathname === subItem.href ||
      (subItem.href !== '/' && pathname?.startsWith(subItem.href))
  );

  if (item.submenu) {
    return (
      <li
        className={`dropdown ${item.title === 'Home' ? 'megamenu' : ''} ${isActive || hasActiveChild ? 'current' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href={item.href}
          className={isActive || hasActiveChild ? 'current' : ''}
        >
          {item.title}
        </Link>
        <ul style={{ display: isOpen ? 'block' : 'none' }}>
          {item.title === 'Home' ? (
            <li>
              <MegaMenu items={[]} />
            </li>
          ) : (
            item.submenu.map((subItem, subIndex) => (
              <MenuItem key={subIndex} item={subItem} />
            ))
          )}
        </ul>
      </li>
    );
  }

  return (
    <li className={isActive ? 'current' : ''}>
      <Link
        href={item.href}
        style={{ fontSize: '16px' }}
        className={isActive ? 'current' : ''}
      >
        {item.title}
      </Link>
    </li>
  );
};

// Login Button Component
const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();

  // Simulating authentication state
  useEffect(() => {
    // Check if user is logged in (you can replace this with your actual auth check)
    const checkAuth = () => {
      const token = localStorage.getItem('authToken'); // Or use your auth context
      setIsLoggedIn(!!token);
    };

    checkAuth();
    // You might want to add an event listener for auth changes here
  }, []);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = () => {
    // Your logout logic here
    console.log('Logout clicked');
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    setIsLoginDropdownOpen(false);
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    // Navigate to profile page
    window.location.href = '/profile';
  };

  return (
    <div className='login-button-container'>
      {isAuthenticated ? (
        <div
          className='user-profile-dropdown'
          onMouseEnter={() => setIsLoginDropdownOpen(true)}
          onMouseLeave={() => setIsLoginDropdownOpen(false)}
        >
          <button className='btn-login user-avatar'>
            <span className='icon-user'></span>
            <span>My Account</span>
          </button>
          {isLoginDropdownOpen && (
            <div className='login-dropdown-menu'>
              <button onClick={handleProfile} className='dropdown-item'>
                <span className='icon-settings'></span>
                Profile
              </button>
              <button onClick={handleLogout} className='dropdown-item'>
                <span className='icon-logout'></span>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleLogin} className='btn-login'>
          <span className='icon-lock'></span>
          <span>Login</span>
        </button>
      )}

      <style jsx>{`
        .login-button-container {
          position: relative;
          margin-left: 15px;
        }

        .btn-login {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0fb4c3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-login:hover {
          background: #0fb4c3;
          transform: translateY(-2px);
        }

        .user-profile-dropdown {
          position: relative;
        }

        .login-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          z-index: 1000;
          margin-top: 5px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          color: #333;
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background: #f5f5f5;
        }

        .dropdown-item .icon-logout {
          color: #e74c3c;
        }

        .dropdown-item .icon-settings {
          color: #0fb4c3;
        }
      `}</style>
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const homeShowcaseItems = [
    {
      title: 'Home Page One',
      image: 'home-showcase-1-1.jpg',
      multiPageLink: '/',
      onePageLink: '/one-page',
      multiPageText: 'Multi Page',
      onePageText: 'One Page'
    }
    // Add other items similarly
  ];

  const mainMenuItems: MenuItem[] = [
    {
      title: 'Home',
      href: '/'
    },
    // {
    //   title: 'Faq',
    //   href: '/faq',
    // },
    {
      title: 'About',
      href: '/about'
    },
    {
      title: 'Contact Us',
      href: '/contact'
    }
  ];

  return (
    <header className='main-header main-header-style3'>
      {/* Top Header */}
      <div className='main-header-style3__top'>
        <div className='auto-container'>
          <div className='outer-box'>
            {/* Left Section */}
            <div className='main-header-style3__top-left'>
              <div className='header-btn-one'>
                <a href='#'>Pay Online</a>
              </div>
              <div className='header-menu-style1'>
                <ul>
                  {/* <li><a href="#">Careers</a></li> */}
                  <li>
                    <Link href='/faq'>Faq's</Link>
                  </li>
                  {/* <li><a href="#">Offers</a></li> */}
                  {/* <li><a href="#">Calendar</a></li> */}
                  <li>
                    <Link href='/calculator'>Calculator</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className='main-header-style3__top-right'>
              <div className='header-contact-info-style1'>
                <ul>
                  <li>
                    <span className='icon-map'></span> 12 Red Rose, LA 90010
                  </li>
                  <li>
                    {/* <span className='icon-clock'></span> 9am to 5pm, Sun Holiday */}
                  </li>
                </ul>
              </div>
              <div className='header-social-link-style1'>
                <ul className='clearfix'>
                  <li>
                    <a href='#'>
                      <i className='fab fa-youtube'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-instagram'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-twitter'></i>
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-facebook-f'></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className='main-menu main-menu-style3'>
        <div className='main-menu__wrapper clearfix'>
          <div className='container'>
            <div className='main-menu__wrapper-inner'>
              {/* Left Section */}
              <div className='main-menu-style3-left'>
                <div className='header-logon-box'>
                  <div className='icon'>
                    <span className='icon-home-button'></span>
                  </div>
                  <div className='select-box'>
                    <select className='wide'>
                      <option value='login'>Login</option>
                      <option value='register'>Register</option>
                    </select>
                  </div>
                </div>
                <div className='logo-box-style3'>
                  <Link href='/'>
                    <div className='flex w-full flex-row items-center justify-start space-x-4'>
                      <img
                        className='h-6 w-14 md:h-10 md:w-32'
                        // src='/assets/images/resources/logo-3.png'
                        src='/assets/images/shapes/card-banner-area-bg.png'
                        alt='Fidelitybank Logo'
                      />
                      <div className='h-fit w-fit'>
                        <h3 className='text-xs! font-bold tracking-wide text-slate-500 md:text-lg!'>
                          Fidelity Offshore Bank{' '}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Middle Section - Main Menu */}
              <div className='main-menu-style3-middle'>
                <div className='main-menu-box'>
                  <a
                    href='#'
                    className='mobile-nav__toggler'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}
                  >
                    <i className='icon-menu'></i>
                  </a>

                  <ul className='main-menu__list'>
                    {mainMenuItems.map((item, index) => (
                      <MenuItem key={index} item={item} />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Section - Now includes Login Button */}
              <div className='main-menu-style3-right'>
                <div className='phone-number-box-style1'>
                  <div className='icon'>
                    <span className='icon-headphones'></span>
                  </div>
                  <h5>Toll Free</h5>
                  <h3>
                    <a href='tel:+80012345678'>+800 123 456 78</a>
                  </h3>
                </div>

                <div className='box-search-style2'>
                  <a href='#' className='search-toggler'>
                    <span className='icon-search'></span>
                    Search
                  </a>
                </div>

                {/* Added Login Button */}
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

//  'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'

// interface MenuItem {
//   title: string
//   href: string
//   submenu?: MenuItem[]
// }

// interface MegaMenuProps {
//   items: Array<{
//     title: string
//     image: string
//     multiPageLink: string
//     onePageLink: string
//     multiPageText: string
//     onePageText: string
//   }>
// }

// const MegaMenu: React.FC<MegaMenuProps> = ({ items }) => {
//   return (
//     <div className="megamenu-content-box">
//       <div className="container">
//         <div className="megamenu-content-box__inner">
//           <div className="row">
//             {items.map((item, index) => (
//               <div className="col-lg-3" key={index}>
//                 <div className="home-showcase__item">
//                   <div className="home-showcase__image">
//                     <img
//                       src={`/assets/images/home-showcase/${item.image}`}
//                       alt={item.title}
//                     />
//                     <div className="home-showcase__buttons">
//                       <Link
//                         href={item.multiPageLink}
//                         className="btn-one home-showcase__buttons__item top"
//                       >
//                         <span className="txt">{item.multiPageText}</span>
//                       </Link>
//                       <Link
//                         href={item.onePageLink}
//                         className="btn-one home-showcase__buttons__item"
//                       >
//                         <span className="txt">{item.onePageText}</span>
//                       </Link>
//                     </div>
//                   </div>
//                   <h3 className="home-showcase__title">{item.title}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   const homeShowcaseItems = [
//     {
//       title: 'Home Page One',
//       image: 'home-showcase-1-1.jpg',
//       multiPageLink: '/',
//       onePageLink: '/one-page',
//       multiPageText: 'Multi Page',
//       onePageText: 'One Page'
//     },
//     // Add other items similarly
//   ]

//   const mainMenuItems: MenuItem[] = [
//     {
//       title: 'Home',
//       href: '/',
//     },
//     // {
//     //   title: 'Services',
//     //   href: '#',
//     //   submenu: [
//     //     {
//     //       title: 'Cards',
//     //       href: '/services/cards',
//     //     },

//     //     {
//     //       title: 'Loans',
//     //       href: '/services/loans',
//     //     },

//     //     {
//     //       title: 'Personal Account',
//     //       href: '/services/personalaccount',
//     //     },
//     //     // Add other service categories
//     //   ]
//     // },
//     {
//       title: 'Faq',
//       href: '/faq',
//       // submenu: [
//         // {
//         //   title: 'Accounts',
//         //   href: '#',
//         //   submenu: [
//         //     { title: 'All Accounts', href: '/accounts' },
//         //     { title: 'Savings Account', href: '/account-savings' },
//         //     // Add other submenu items
//           // ]
//         // },

//         // Add other service categories
//       // ]
//     },

//      {
//       title: 'About',
//       href: '/about',
//     },
//      {
//       title: 'Contact Us',
//       href: '/contact',
//     },
//   ]

//   return (
//     <header className="main-header main-header-style3">
//       {/* Top Header */}
//       <div className="main-header-style3__top">
//         <div className="auto-container">
//           <div className="outer-box">
//             {/* Left Section */}
//             <div className="main-header-style3__top-left">
//               <div className="header-btn-one">
//                 <a href="#">Pay Online</a>
//               </div>
//               <div className="header-menu-style1">
//                 <ul>
//                   {/* <li><a href="#">Careers</a></li>
//                   <li><a href="#">Faq's</a></li>
//                   <li><a href="#">Offers</a></li>
//                   <li><a href="#">Calendar</a></li>
//                   <li><a href="#">Calculator</a></li> */}
//                 </ul>
//               </div>
//             </div>

//             {/* Right Section */}
//             <div className="main-header-style3__top-right">
//               <div className="header-contact-info-style1">
//                 <ul>
//                   <li><span className="icon-map"></span> 12 Red Rose, LA 90010</li>
//                   <li><span className="icon-clock"></span> 9am to 5pm, Sun Holiday</li>
//                 </ul>
//               </div>
//               <div className="header-social-link-style1">
//                 <ul className="clearfix">
//                   <li>
//                     <a href="#">
//                       <i className="fab fa-youtube"></i>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#">
//                       <i className="fab fa-instagram"></i>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#">
//                       <i className="fab fa-twitter"></i>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#">
//                       <i className="fab fa-facebook-f"></i>
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation */}
//       <nav className="main-menu main-menu-style3">
//         <div className="main-menu__wrapper clearfix">
//           <div className="container">
//             <div className="main-menu__wrapper-inner">

//               {/* Left Section */}
//               <div className="main-menu-style3-left">
//                 <div className="header-logon-box">
//                   <div className="icon">
//                     <span className="icon-home-button"></span>
//                   </div>
//                   <div className="select-box">
//                     <select className="wide">
//                       <option value="login">Login</option>
//                       <option value="register">Register</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="logo-box-style3">
//                   <Link href="/">
//                     <img
//                       src="/assets/images/resources/logo-3.png"
//                       alt="Finbank Logo"
//                     />
//                   </Link>
//                 </div>
//               </div>

//               {/* Middle Section - Main Menu */}
//               <div className="main-menu-style3-middle">
//                 <div className="main-menu-box">
//                   <a
//                     href="#"
//                     className="mobile-nav__toggler"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       setIsMobileMenuOpen(!isMobileMenuOpen)
//                     }}
//                   >
//                     <i className="icon-menu"></i>
//                   </a>

//                   <ul className="main-menu__list">
//                     {mainMenuItems.map((item, index) => (
//                       <MenuItem key={index} item={item} />
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Right Section */}
//               <div className="main-menu-style3-right">
//                 <div className="phone-number-box-style1">
//                   <div className="icon">
//                     <span className="icon-headphones"></span>
//                   </div>
//                   <h5>Toll Free</h5>
//                   <h3><a href="tel:+80012345678">+800 123 456 78</a></h3>
//                 </div>

//                 <div className="box-search-style2">
//                   <a href="#" className="search-toggler">
//                     <span className="icon-search"></span>
//                     Search
//                   </a>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   )
// }

// // MenuItem Component
// const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
//   const [isOpen, setIsOpen] = useState(false)

//   if (item.submenu) {
//     return (
//       <li
//         className={`dropdown ${item.title === 'Home' ? 'megamenu' : ''}`}
//         onMouseEnter={() => setIsOpen(true)}
//         onMouseLeave={() => setIsOpen(false)}
//       >
//         <a href={item.href}>{item.title}</a>
//         <ul style={{ display: isOpen ? 'block' : 'none' }}>
//           {item.title === 'Home' ? (
//             <li>
//               <MegaMenu items={[]} /> {/* Pass your items here */}
//             </li>
//           ) : (
//             item.submenu.map((subItem, subIndex) => (
//               <MenuItem key={subIndex} item={subItem} />
//             ))
//           )}
//         </ul>
//       </li>
//     )
//   }

//   return (
//     <li>
//       <Link href={item.href}>{item.title}</Link>
//     </li>
//   )
// }
