import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HeroSlider from '../components/mainpage/HeroSlider'
import SloganArea from '../components/mainpage/SloganArea'
import AccountsSection from '../components/mainpage/AccountsSection'
import PartnerCarousel from '../components/mainpage/PartnerCarousel'
import BankingTabs from '../components/mainpage/BankingTabs'
import BenefitsSection from '../components/mainpage/BenefitsSection'
import ServiceRequest from '../components/mainpage/ServiceRequest'
import AccountSteps from '../components/mainpage/AccountSteps'
import FeaturesSection from '../components/mainpage/FeaturesSection'
import Testimonials from '../components/mainpage/Testimonials'
import BlogSection from '../components/mainpage/BlogSection'
import Layout from '../components/mainpage/Layout';
import { HeroHeader } from '@/components/ark-component/header';
import HeroSection from '@/components/ark-component/hero';
import FinflowHero from '@/components/finflow/FinflowHero';
import FinflowOverview from '@/components/finflow/FinflowOverview';
import FinflowFeatures from '@/components/finflow/FinflowFeatures';
import FinflowChoiceSection from '@/components/finflow/FinflowChoiceSection';
import FinflowControlSection from '@/components/finflow/FinflowControlSection';
import FinflowTestimonial from '@/components/finflow/FinflowTestimonial';
import FinflowIntegrations from '@/components/finflow/FinflowIntegrations';

export default async function Page() {
  const { userId , sessionClaims,  } = await auth();

  // if (!userId) {
  //   return redirect('/auth/sign-in');
  // } else {
  //   redirect('/dashboard/overview');
  // }
    return (
    <div >
    <Layout>
      {/* <HeroSlider />
      <SloganArea />
      <AccountsSection />
      <PartnerCarousel />
      <BankingTabs />
      <BenefitsSection />
      <ServiceRequest />
      <AccountSteps />
      <FeaturesSection />
      <Testimonials />
      <BlogSection /> */}

       {/* FinFlow Modern Sections */}
      {/* <FinflowHero /> */}
       <HeroSlider />
      <FinflowOverview />
      <AccountsSection />
      <FinflowFeatures />
      <FinflowControlSection />
      <FinflowChoiceSection />
      <FinflowTestimonial />
      <FinflowIntegrations />
      
      {/* Original Components (Enhanced) */}
      <PartnerCarousel />
      <BenefitsSection />
      <ServiceRequest />
      <AccountSteps />
      {/* <SloganArea /> */}
      <FeaturesSection />
      {/* <Testimonials /> */}
      <BlogSection />
      </Layout>
    </div>
  )
}
