// app/pages/UserUpdatePage.tsx
import React from 'react';
import { UserUpdateScreen } from '~/components/user/UserUpdateScreen';
import { useUserUpdate } from '~/hooks/useUserUpdate';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';

export default function UserUpdatePage() {
  const {
    formData,
    errors,
    loading,
    message,
    messageType,
    userData,
    handleFormChange,
    handleFetchUser,
    handleSave,
    handleSaveAndExit,
    handleClear,
    handleExit,
  } = useUserUpdate({
    onError: (error) => {
      console.error('User update error:', error);
    },
    onSuccess: (message) => {
      console.log('User update success:', message);
    },
  });

  if (loading && !userData) {
    return <LoadingSpinner />;
  }

  return (
    <UserUpdateScreen
      formData={formData}
      errors={errors}
      loading={loading}
      message={message}
      messageType={messageType}
      userData={userData}
      onFormChange={handleFormChange}
      onFetchUser={handleFetchUser}
      onSave={handleSave}
      onSaveAndExit={handleSaveAndExit}
      onClear={handleClear}
      onExit={handleExit}
    />
  );
}