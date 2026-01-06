'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

// Login Button Component for desktop
const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { user, isAuthenticated, isLoading, error, logout } = useAuth();
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
    logout();
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    // Navigate to profile page
    router.push('/profile');
  };

  return (
    <div className='login-button-container'>
      {isAuthenticated ? (
        <div
          className='user-profile-dropdown'
          onMouseEnter={() => setIsLoginDropdownOpen(true)}
          onMouseLeave={() => setIsLoginDropdownOpen(false)}
        >
          <button onClick={handleLogout} className='dropdown-item'>
            <span className='icon-logout'></span>
            Logout
          </button>
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

// Mobile Login Menu Item - Only shows on mobile
const MobileLoginMenuItem = () => {
  const pathname = usePathname();
  const isActive = pathname === '/auth/login';
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <li className={`mobile-only ${isActive ? 'current' : ''}`}>
      <Link
        href={isAuthenticated ? '/profile' : '/auth/login'}
        style={{ fontSize: '16px' }}
        className={isActive ? 'current' : ''}
        onClick={handleClick}
      >
        {isAuthenticated ? 'My Account' : 'Login'}
      </Link>
    </li>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
    {
      title: 'About',
      href: '/about'
    },
    {
      title: 'Contact Us',
      href: '/contact'
    }
    // Note: Login is NOT included here for desktop - it will only show in mobile menu
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
                  <li>
                    <Link href='/faq'>Faq's</Link>
                  </li>
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
                    {/* Regular menu items - show on all screens */}
                    {mainMenuItems.map((item, index) => (
                      <MenuItem key={index} item={item} />
                    ))}

                    {/* Mobile-only Login menu item */}
                    {isMobile && <MobileLoginMenuItem />}
                  </ul>
                </div>
              </div>

              {/* Right Section - Desktop Login Button (hidden on mobile) */}
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

                {/* Desktop Login Button - hidden on mobile */}
                {!isMobile && <LoginButton />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Styles */}
      <style jsx global>{`
        /* Hide mobile login item on desktop */
        @media (min-width: 768px) {
          .mobile-only {
            display: none !important;
          }
        }

        /* Hide desktop login button on mobile */
        @media (max-width: 767px) {
          .main-menu-style3-right .login-button-container {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
