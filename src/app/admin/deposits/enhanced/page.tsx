'use client';

import PageContainer from '@/components/layout/page-container';
import EnhancedAdminContainer from '@/components/admin/EnhancedAdminContainer';
import EnhancedDepositsTable from '@/components/admin/EnhancedDepositsTable';

export default function AdminEnhancedDepositsPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='Enhanced Deposits'
      pageDescription='Advanced deposit monitoring and verification'
    >
      <EnhancedAdminContainer>
        <EnhancedDepositsTable showFilters={true} showActions={true} />
      </EnhancedAdminContainer>
    </PageContainer>
  );
}
