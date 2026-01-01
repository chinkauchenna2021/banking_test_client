import LoanApplicationSection from '@/components/loans/LoanApplicationSection'
import LoanSection from '@/components/loans/LoanSection'
import Layout from '@/components/mainpage/Layout'
import React from 'react'

function Loans() {
  return (
    <div>
       <Layout>
           <LoanApplicationSection />
       </Layout>
    </div>
  )
}

export default Loans