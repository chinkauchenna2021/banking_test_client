'use client';

import PageContainer from '@/components/layout/page-container';
import EnhancedAdminContainer from '@/components/admin/EnhancedAdminContainer';
import EnhancedUsersTable from '@/components/admin/EnhancedUsersTable';

export default function EnhancedUsersPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='Enhanced User Management'
      pageDescription='Comprehensive user management with advanced filtering and analytics'
    >
      <EnhancedAdminContainer>
        <EnhancedUsersTable showFilters={true} />
      </EnhancedAdminContainer>
    </PageContainer>
  );
}
