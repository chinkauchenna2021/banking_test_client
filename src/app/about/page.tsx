import BreadcrumbArea from '@/components/BreadcrumbArea'
import AwardsAchivementsArea from '@/components/mainpage/about/AwardsAchivementsArea'
import ChooseStyle1Area from '@/components/mainpage/about/ChooseStyle1Area'
import FactsArea from '@/components/mainpage/about/FactsArea'
import IntroStyle1Area from '@/components/mainpage/about/IntroStyle1Area'
import StatementsArea from '@/components/mainpage/about/StatementsArea'
import StatisticsArea from '@/components/mainpage/about/StatisticsArea'
import Layout from '@/components/mainpage/Layout'
import React from 'react'

function About() {
  return (
    <Layout>
        <BreadcrumbArea 
        title="About Bank"
        backgroundImage="/assets/images/backgrounds/breadcrumb-area-bg.jpg"
        links={[
          { name: 'Home', href: '/' },
          { name: 'About Bank', href: '#', active: true }
        ]}
      />

      <IntroStyle1Area />
      <ChooseStyle1Area />
      <StatementsArea />
      <FactsArea />
      <StatisticsArea />
      <AwardsAchivementsArea />

    </Layout>
  )
}

export default About