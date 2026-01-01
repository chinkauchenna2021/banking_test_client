import PersonalAccountSection from '@/components/accounts/PersonalAccountSection'
import SavingsAccountSection from '@/components/accounts/SavingsAccountSection'
import Layout from '@/components/mainpage/Layout'
import React from 'react'

function PersonalAccount() {
  return (
    <div>
       <Layout>
           <SavingsAccountSection />
       </Layout>
    </div>
  )
}

export default PersonalAccount