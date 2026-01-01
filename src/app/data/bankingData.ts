// app/data/bankingData.ts
export interface Account {
  id: number
  image: string
  title: string
  description: string
  link: string
}

export interface Slide {
  id: number
  image: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface ServiceItem {
  id: number
  icon: string
  title: string
  link: string
}

export interface Benefit {
  id: number
  icon: string
  title: string
  description: string
}

export interface Step {
  id: number
  icon: string
  number: string
  title: string
  description: string
}

export interface Tab {
  id: string
  icon: string
  subtitle: string
  title: string
  image: string
  mainTitle: string
  mainSubtitle: string
  description: string
  features: string[]
}

export interface BlogPost {
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

export interface Testimonial {
  id: number
  name: string
  location: string
  image: string
  text: string
  rating: number
  company?: string
}

export interface Partner {
  id: number
  logo: string
  link: string
}

export interface WalletIntegration {
  id: number
  name: string
  icon: string
  description: string
}

// Updated data with consistent banking content
export const accounts: Account[] = [
  {
    id: 1,
    image: '/assets/images/resources/account-1.jpg',
    title: 'Checking Account',
    description: 'Access your money anytime with our no-fee checking account, featuring unlimited transactions and mobile check deposit.',
    link: '/accounts/checking'
  },
  {
    id: 2,
    image: '/assets/images/resources/account-2.jpg',
    title: 'Savings Account',
    description: 'Grow your savings with competitive interest rates and automated savings tools to help you reach your financial goals faster.',
    link: '/accounts/savings'
  },
  {
    id: 3,
    image: '/assets/images/resources/account-3.jpg',
    title: 'High-Yield Savings',
    description: 'Earn up to 5.25% APY with our premium savings account and enjoy flexible access to your funds with no withdrawal limits.',
    link: '/accounts/high-yield'
  }
]

export const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/slides/slide-v3-1.jpg',
    title: 'Digital Banking<br /> Made Simple',
    description: 'Manage your finances securely from anywhere with our award-winning mobile app and online banking platform.',
    buttonText: 'Open Account',
    buttonLink: '/open-account'
  },
  {
    id: 2,
    image: '/assets/images/slides/slide-v3-2.jpg',
    title: 'Send Money<br /> Instantly & Securely',
    description: 'Transfer funds to anyone, anywhere with real-time processing and military-grade encryption for ultimate security.',
    buttonText: 'Send Payment',
    buttonLink: '/transfer'
  },
  {
    id: 3,
    image: '/assets/images/slides/slide-v3-3.jpg',
    title: 'Smart Investments<br /> For Your Future',
    description: 'Start investing with as little as $100 and access expert guidance through our automated investment platform.',
    buttonText: 'Start Investing',
    buttonLink: '/investments'
  }
]

export const serviceItems: ServiceItem[] = [
  {
    id: 1,
    icon: 'icon-credit-card',
    title: 'Credit & Debit Cards',
    link: '/cards'
  },
  {
    id: 2,
    icon: 'icon-computer',
    title: 'Mobile & Online Banking',
    link: '/digital-banking'
  },
  {
    id: 3,
    icon: 'icon-book',
    title: 'Account Management',
    link: '/account-services'
  },
  {
    id: 4,
    icon: 'icon-check-book',
    title: 'Check Services',
    link: '/check-services'
  }
]

export const benefits: Benefit[] = [
  {
    id: 1,
    icon: 'icon-high',
    title: 'High Interest Savings',
    description: 'Earn up to 10x the national average with our competitive savings account rates.'
  },
  {
    id: 2,
    icon: 'icon-notification',
    title: 'Real-Time Alerts',
    description: 'Receive instant notifications for transactions, deposits, and account activity.'
  },
  {
    id: 3,
    icon: 'icon-safebox',
    title: 'Digital Safe Deposit',
    description: 'Store important documents securely in our encrypted digital vault.'
  },
  {
    id: 4,
    icon: 'icon-credit-card-2',
    title: 'Contactless Payments',
    description: 'Make secure payments with tap-to-pay technology on all our debit cards.'
  },
  {
    id: 5,
    icon: 'icon-shield-1',
    title: 'Advanced Security',
    description: 'Biometric authentication and 256-bit encryption protect your accounts 24/7.'
  },
  {
    id: 6,
    icon: 'icon-paperless',
    title: 'Paperless Banking',
    description: 'Go green with digital statements and electronic document delivery.'
  }
]

export const steps: Step[] = [
  {
    id: 1,
    icon: 'icon-consultation',
    number: '01',
    title: 'Apply Online',
    description: 'Complete our simple digital application in under 10 minutes with no paperwork required.'
  },
  {
    id: 2,
    icon: 'icon-file-1',
    number: '02',
    title: 'Identity Verification',
    description: 'Securely verify your identity using our automated KYC process with instant approval.'
  },
  {
    id: 3,
    icon: 'icon-investment',
    number: '03',
    title: 'Start Banking',
    description: 'Access your new account immediately through our mobile app and online banking platform.'
  }
]

export const tabs: Tab[] = [
  {
    id: 'income',
    icon: 'icon-trading',
    subtitle: 'FinFlow',
    title: 'Income & Expenses Tracker',
    image: '/assets/images/site/Online-Banking-Income-Image-1.webp',
    mainTitle: 'Income and Expenses Tracker',
    mainSubtitle: 'Smart Money<br /> Management',
    description: 'Track every transaction automatically, categorize spending, and gain insights into your financial habits with AI-powered analytics.',
    features: [
      'Automatic transaction categorization',
      'Customizable budget categories',
      'Spending trend analysis',
      'Bill payment reminders',
      'Financial goal tracking',
      'Multi-account aggregation'
    ]
  },
  {
    id: 'automated',
    icon: 'icon-fee',
    subtitle: 'FinFlow',
    title: 'Automated Invoicing',
    image: '/assets/images/site/Online-Banking-Automated-Image.webp',
    mainTitle: 'Automated Invoicing',
    mainSubtitle: 'Streamlined<br /> Business Payments',
    description: 'Create, send, and track invoices automatically with integrated payment processing and accounting software sync.',
    features: [
      'Recurring invoice automation',
      'Online payment collection',
      'Late payment reminders',
      'Accounting system integration',
      'Multi-currency billing',
      'Client payment portal'
    ]
  },
  {
    id: 'crypto',
    icon: 'icon-gold-ingots',
    subtitle: 'FinFlow',
    title: 'Crypto Integration',
    image: '/assets/images/site/Online-Banking-Crypto-Image-1.webp',
    mainTitle: 'Crypto Integration',
    mainSubtitle: 'Digital Asset<br /> Management',
    description: 'Buy, sell, and store cryptocurrencies alongside traditional banking with institutional-grade security and insurance.',
    features: [
      'Bitcoin and Ethereum trading',
      'Secure cold storage wallets',
      'Real-time crypto pricing',
      'Automated dollar-cost averaging',
      'Tax reporting tools',
      'Portfolio performance tracking'
    ]
  }
]

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: '/assets/images/blog/blog-v2-1.jpg',
    category: 'Digital Banking',
    categoryIcon: 'icon-play-button-1',
    date: 'May 29, 2024',
    author: 'Sarah Johnson',
    authorLink: '#',
    title: 'How to Maximize Your<br /> Digital Banking Security',
    readTime: '5 Mins Read',
    comments: '12 Comments',
    link: '/blog/digital-security'
  },
  {
    id: 2,
    image: '/assets/images/blog/blog-v2-2.jpg',
    category: 'Investing',
    categoryIcon: 'icon-play-button-1',
    date: 'May 25, 2024',
    author: 'Michael Chen',
    authorLink: '#',
    title: 'Smart Ways to Grow<br /> Your Savings in 2024',
    readTime: '7 Mins Read',
    comments: '8 Comments',
    link: '/blog/savings-growth'
  },
  {
    id: 3,
    image: '/assets/images/blog/blog-v3-3.jpg',
    category: 'Mobile Banking',
    categoryIcon: 'icon-play-button-1',
    date: 'May 20, 2024',
    author: 'Jessica Williams',
    authorLink: '#',
    title: 'Mobile Banking Features<br /> You Should Be Using',
    readTime: '4 Mins Read',
    comments: '15 Comments',
    link: '/blog/mobile-features'
  }
]

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    location: 'San Francisco, CA',
    image: '/assets/images/site/Online-Banking-Testimonial-Image.webp',
    text: "FinFlow's mobile app has transformed how I manage my business finances. The automated invoicing saved me 10+ hours per week, and the real-time analytics help me make better financial decisions.",
    rating: 5,
    company: 'Small Business Owner'
  },
  {
    id: 2,
    name: 'David Rodriguez',
    location: 'Miami, FL',
    image: '/assets/images/testimonial/testimonial-v1-1.jpg',
    text: 'The high-yield savings account offers rates I couldn’t find anywhere else. Customer service is responsive, and the platform is incredibly user-friendly. Highly recommended for digital banking.',
    rating: 5,
    company: 'Freelance Designer'
  },
  {
    id: 3,
    name: 'Jennifer Kim',
    location: 'New York, NY',
    image: '/assets/images/testimonial/testimonial-v1-2.jpg',
    text: 'As someone who travels frequently, having reliable international banking services is crucial. FinFlow makes international transfers seamless with low fees and excellent exchange rates.',
    rating: 5,
    company: 'International Consultant'
  }
]

export const partners: Partner[] = [
  { id: 1, logo: '/assets/images/brand/brand-1-1.png', link: 'https://visa.com' },
  { id: 2, logo: '/assets/images/brand/brand-1-2.png', link: 'https://mastercard.com' },
  { id: 3, logo: '/assets/images/brand/brand-1-3.png', link: 'https://fdic.gov' },
  { id: 4, logo: '/assets/images/brand/brand-1-4.png', link: 'https://apple.com/pay' },
  { id: 5, logo: '/assets/images/brand/brand-1-5.png', link: 'https://google.com/pay' },
  { id: 6, logo: '/assets/images/brand/brand-1-6.png', link: 'https://samsung.com/pay' }
]

// Wallet Integrations
export const walletIntegrations: WalletIntegration[] = [
  {
    id: 1,
    name: 'Apple Pay',
    icon: '/assets/images/site/Online-Banking-Wallet-Image-1.webp',
    description: 'Make secure contactless payments in stores, apps, and online using your Apple devices with tokenized security.'
  },
  {
    id: 2,
    name: 'Google Pay',
    icon: '/assets/images/site/Online-Banking-Wallet-Image-2.webp',
    description: 'Link your accounts for fast, secure payments across millions of merchants with Google Pay integration.'
  },
  {
    id: 3,
    name: 'Samsung Pay',
    icon: '/assets/images/site/Online-Banking-Wallet-Image-3.webp',
    description: 'Use your Samsung devices for contactless payments anywhere that accepts traditional magnetic stripe cards.'
  },
  {
    id: 4,
    name: 'PayPal',
    icon: '/assets/images/site/Online-Banking-Wallet-Image-4.webp',
    description: 'Connect your bank accounts for seamless online shopping and peer-to-peer payments through PayPal.'
  }
]

// Additional banking features
export const bankingFeatures = [
  {
    id: 1,
    title: '24/7 Account Access',
    description: 'Full banking services available anytime through mobile and web platforms'
  },
  {
    id: 2,
    title: 'Zero Account Fees',
    description: 'No monthly maintenance fees or minimum balance requirements'
  },
  {
    id: 3,
    title: 'Instant Transfers',
    description: 'Send money to anyone with real-time processing and immediate availability'
  },
  {
    id: 4,
    title: 'Financial Insights',
    description: 'AI-powered analytics to help you understand and improve your finances'
  }
]

// Security features
export const securityFeatures = [
  {
    id: 1,
    feature: 'Biometric Authentication',
    description: 'Fingerprint and facial recognition for secure login'
  },
  {
    id: 2,
    feature: 'End-to-End Encryption',
    description: 'Bank-level encryption for all data transmission and storage'
  },
  {
    id: 3,
    feature: 'Fraud Monitoring',
    description: '24/7 automated monitoring for suspicious activity'
  },
  {
    id: 4,
    feature: 'FDIC Insurance',
    description: 'Up to $250,000 in deposit insurance per account'
  }
]