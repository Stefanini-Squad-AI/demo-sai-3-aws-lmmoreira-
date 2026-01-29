// app/pages/UserDeletePage.tsx
import React from 'react';
import { UserDeleteScreen } from '~/components/user/UserDeleteScreen';
import { useUserDelete } from '~/hooks/useUserDelete';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';

export default function UserDeletePage() {
  const {
    formData,
    errors,
    loading,
    message,
    messageType,
    userData,
    handleFormChange,
    handleFetchUser,
    handleDelete,
    handleClear,
    handleExit,
  } = useUserDelete({
    onError: (error) => {
      console.error('User delete error:', error);
    },
    onSuccess: (message) => {
      console.log('User delete success:', message);
    },
  });

  if (loading && !userData) {
    return <LoadingSpinner />;
  }

  return (
    <UserDeleteScreen
      formData={formData}
      errors={errors}
      loading={loading}
      message={message}
      messageType={messageType}
      userData={userData}
      onFormChange={handleFormChange}
      onFetchUser={handleFetchUser}
      onDelete={handleDelete}
      onClear={handleClear}
      onExit={handleExit}
    />
  );
}