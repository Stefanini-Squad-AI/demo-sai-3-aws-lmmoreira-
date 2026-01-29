// app/pages/UserListPage.tsx
import React from 'react';
import { UserListScreen } from '~/components/user/UserListScreen';
import { useUserList } from '~/hooks/useUserList';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';

export default function UserListPage() {
  const {
    users,
    pagination,
    searchCriteria,
    loading,
    error,
    handleSearch,
    handlePageChange,
    handleUserAction,
    handleExit,
  } = useUserList({
    onError: (error) => {
      console.error('User list error:', error);
    },
    onUserAction: (action) => {
      console.log('User action processed:', action);
    },
  });

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <UserListScreen
      users={users}
      pagination={pagination}
      searchCriteria={searchCriteria}
      loading={loading}
      error={error}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onUserAction={handleUserAction}
      onExit={handleExit}
    />
  );
}